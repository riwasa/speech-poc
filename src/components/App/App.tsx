import { getClassNames } from "./App.classNames";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { useEffect, useRef, useState } from "react";
import { DefaultButton, Panel, PanelType } from "@fluentui/react";
import AudioPlayer from "components/AudioPlayer/AudioPlayer";
import CallHighlightsView from "components/CallHighlightsView/CallHighlightsView";
import { generateTranscript, JsonResultOutput, Transcript } from "utils/transcription";
import { CallSummary, generateCallSummary } from "utils/callSummary";
import { useBoolean } from "@fluentui/react-hooks";
import { PublicClientApplication } from "@azure/msal-browser"; // Import the missing module

import FilesExplorer from "components/FilesExplorer/FilesExplorer";
import NavBar from "components/NavBar/NavBar";
import FilterBar from "components/FilterBar/FilterBar";
import OptionsBar from "components/OptionsBar/OptionsBar";
import SideBar from "components/SideBar/SideBar";
import ConnectionStringBar from "components/ConnectionStringBar/ConnectionStringBar";
import { Blob, getJsonData } from "utils/blobData";
import PaginatedAudio from "utils/audioPagination";

import { DefaultAzureCredential, InteractiveBrowserCredential } from "@azure/identity";

export type LoadingStatus = "pending" | "loading" | "successful" | "failed";

const classNames = getClassNames();

function App() {
  const [blobs, setBlobs] = useState<Array<Blob>>([]);
  const [blobsLoadingStatus, setBlobsLoadingStatus] =
    useState<LoadingStatus>("pending");
  const paginatedAudioRef = useRef<PaginatedAudio>();

  const [audioUrl, setAudioUrl] = useState("");
  const [callSummary, setCallSummary] = useState<CallSummary>();
  const [transcript, setTranscript] = useState<Transcript>([]);
  const [transcriptLoadingStatus, setTranscriptLoadingStatus] =
    useState<LoadingStatus>("pending");

  const [blobServiceSas, setBlobServiceSas] = useState<string>("");

  const blobServiceClientRef = useRef<BlobServiceClient>();
  const jsonResultOutputContainerClientRef = useRef<ContainerClient>();

  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(false);

  const getJsonResultOutput = async (audioFileName: string) => {
    if (!jsonResultOutputContainerClientRef.current) {
      return Promise.reject();
    }
    const blobClient = jsonResultOutputContainerClientRef.current.getBlobClient(
      `${audioFileName}.json`
    );
    return await getJsonData(blobClient.url);
  };

  useEffect(() => {
    if (!blobServiceSas) {
      return;
    }

    try {
      blobServiceClientRef.current =
        BlobServiceClient.fromConnectionString(blobServiceSas);
    } catch (error) {
      console.log(error);
      setBlobsLoadingStatus("failed");
      return;
    }

    if (!blobServiceClientRef.current) {
      return;
    }

    paginatedAudioRef.current = new PaginatedAudio(
      blobServiceClientRef.current,
      "aoai-processed",
      10
    );

    jsonResultOutputContainerClientRef.current =
      blobServiceClientRef.current.getContainerClient("aoai-json-result-output");

    const setAudioBlobs = async () => {
      if (!blobServiceClientRef.current || !paginatedAudioRef.current) {
        setBlobsLoadingStatus("failed");
        return;
      }
      setBlobsLoadingStatus("loading");
      try {
        const newBlobs = await paginatedAudioRef.current
          .getNextAudioBlobs()
          .catch(() => []);

        setBlobs(newBlobs);
        setBlobsLoadingStatus("successful");
      } catch (e) {
        setBlobsLoadingStatus("failed");
      }
    };
    setAudioBlobs();
  }, [blobServiceSas]);

  const loadNextAudioBlobPage = async () => {
    if (!blobServiceClientRef.current || !paginatedAudioRef.current) {
      setBlobsLoadingStatus("failed");
      return;
    }
    setBlobsLoadingStatus("loading");
    const newBlobs = await paginatedAudioRef.current.getNextAudioBlobs();
    setBlobs([...blobs, ...newBlobs]);
    setBlobsLoadingStatus("successful");
  };

  const showAudioPlayer = async (item: Blob) => {
    setAudioUrl(item.blobClient.url);
    setTranscript([]);
    setTranscriptLoadingStatus("loading");
    openPanel();
    const jsonResult = await getJsonResultOutput(item.name);
    setTranscript(generateTranscript(jsonResult));
    setCallSummary(generateCallSummary(jsonResult));
    setTranscriptLoadingStatus("successful");
  };

  return (
    <div className={classNames.root}>
      <div className={classNames.navBar}>
        <NavBar />
      </div>
      <div className={classNames.sideBar}>
        <SideBar />
      </div>
      <div className={classNames.mainBody}>
        <ConnectionStringBar
          blobServiceSas={blobServiceSas}
          onConnect={setBlobServiceSas}
        />
        <OptionsBar />
        <FilterBar />

        <FilesExplorer
          showAudioPlayer={showAudioPlayer}
          blobs={blobs}
          loadingStatus={blobsLoadingStatus}
        />
        <div className={classNames.paginationContainer}>
          <DefaultButton text="load more" onClick={loadNextAudioBlobPage} />
        </div>

        <Panel
          isLightDismiss
          isOpen={isOpen}
          onDismiss={dismissPanel}
          closeButtonAriaLabel="Close"
          headerText="Audio Player"
          type={PanelType.large}
        >
          <table>
            <tr>
              <td>
                <AudioPlayer
                  src={audioUrl}
                  transcript={transcript}
                  transcriptLoadingStatus={transcriptLoadingStatus}
                />
              </td>
              <td valign="top">
                <CallHighlightsView callSummary={callSummary} />
              </td>
            </tr>
          </table>         
        </Panel>
      </div>
    </div>
  );
}

export default App;
