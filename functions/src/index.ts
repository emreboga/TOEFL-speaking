import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { SpeechClient, protos } from "@google-cloud/speech";

admin.initializeApp();
const speechClient = new SpeechClient();

exports.transcribeAudio = functions.firestore
  .document("users/{userId}/tests_taken/{testId}")
  .onCreate(async (snap, context) => {
    const {userId} = context.params;
    const documentData = snap.data();
    const audioUrls: string[] = [
      documentData.audio1,
      documentData.audio2,
      documentData.audio3,
      documentData.audio4,
    ].filter((url): url is string => typeof url === "string");

    const transcriptions: Array<{
      transcription: string;
      confidence: number;
    }> = [];

    for (const url of audioUrls) {
      const audio: protos.google.cloud.speech.v1.IRecognitionAudio = {uri: url};
      const config: protos.google.cloud.speech.v1.IRecognitionConfig = {
        encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding
          .LINEAR16,
        sampleRateHertz: 48000,
        languageCode: "en-US",
        enableWordConfidence: true,
        enableAutomaticPunctuation: true,
      };
      try {
        const [operation] = await speechClient.longRunningRecognize({
          audio,
          config,
        });
        const [response] = await operation.promise();
        if (response.results) {
          const transcriptionData = response.results
            .map(
              (result: protos.google.cloud.speech.v1.ISpeechRecognitionResult
              ) => ({
                transcription: result.alternatives?.[0].transcript || "",
                confidence: result.alternatives?.[0].confidence || 0,
              }))
            .reduce(
              (
                {transcription, confidence},
                {transcription: t, confidence: c},
                _,
                array
              ) => ({
                transcription: `${transcription}\n${t}`.trim(),
                confidence: confidence + (c / array.length),
              }),
              {transcription: "", confidence: 0},
            );

          transcriptions.push(transcriptionData);
        }
      } catch (error) {
        console.error(`Failed to transcribe ${url}:`, error);
      }
    }

    if (transcriptions.length > 0) {
      await admin.firestore()
        .doc(`users/${userId}/audio_text/${snap.id}`)
        .set({transcriptions});
    }
  });
