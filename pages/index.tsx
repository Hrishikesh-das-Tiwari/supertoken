import React, { useEffect, useState } from "react";
import Head from "next/head";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";
import styles from "../styles/ProtectedHome.module.css";
import SessionReact from "supertokens-auth-react/recipe/session";
import SuperTokensReact from "supertokens-auth-react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import * as SuperTokensConfig from "../config/frontendConfig";
import {
  BlogsIcon,
  GuideIcon,
  SeparatorLine,
  SignOutIcon,
} from "../assets/images";
import Image from "next/image";

if (typeof window !== "undefined") {
  SuperTokensReact.init(SuperTokensConfig.frontendConfig());
}

interface ILink {
  name: string;
  onClick: () => void;
  icon: string;
}

function ProtectedPage() {
  const [workspace, setWorkspace] = useState([]);
  const session = useSessionContext();

  useEffect(() => {
    fetchWorkspace();
  },[]);

  async function logoutClicked() {
    await SessionReact.signOut();
    SuperTokensReact.redirectToAuth();
  }

  async function handleCreateWorkspace() {
    try {
      const res = await axios.post("/api/workspace");
      const { myWorkspace } = res.data;
      setWorkspace(myWorkspace);
    } catch (error) {
      alert(JSON.stringify(error));
    }
  }

  async function fetchWorkspace() {
    try {
      const res = await axios.get("/api/workspace");
      const { myWorkspace } = res.data;
      setWorkspace(myWorkspace);
    } catch (error) {
      alert(JSON.stringify(error));
    }
  }

  async function handleDeleteWorkspace(workspaceId) {
    try {
      const res = await axios.delete("api/workspace/" + workspaceId);
      const { myWorkspace } = res.data;
      setWorkspace(myWorkspace);
    } catch (error) {
      alert(JSON.stringify(error));
    }
  }

  if (session.loading === true) {
    return null;
  }

  function openLink(url: string) {
    window.open(url, "_blank");
  }

  const links: ILink[] = [
    {
      name: "Workspace",
      onClick: fetchWorkspace,
      icon: BlogsIcon,
    },
    {
      name: "Create",
      onClick: handleCreateWorkspace,
      icon: GuideIcon,
    },
    {
      name: "Sign Out",
      onClick: logoutClicked,
      icon: SignOutIcon,
    },
  ];

  return (
    <div className={styles.homeContainer}>
      <Head>
        <title>WorkSpace</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.mainContainer}>
        <div
          className={`${styles.topBand} ${styles.successTitle} ${styles.bold500}`}
        >
          Your Workspace
        </div>
        <div className={styles.innerContent}>
          {workspace?.map((space, index) => (
            <div key={index} className={`${styles.truncate} ${styles.userId}`}>
              <div className="text-red-600 mb-2">
                WorkspaceID : <span className="text-black">{space?._id}</span>
              </div>
              <div className="text-red-600">
                Workspace Name :{" "}
                <span className="text-black">{space?.name}</span>
              </div>
              <button
                onClick={() => handleDeleteWorkspace(space?._id)}
                className="bg-black hover:bg-stone-600 text-white font-bold py-2 px-4 rounded-full absolute top-3 right-0 m-8 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
              >
                <AiFillDelete />
              </button>
            </div>
          ))}

          <div onClick={handleCreateWorkspace} className={styles.sessionButton}>
            Create Workspace
          </div>
        </div>
      </div>
      <div className={styles.bottomLinksContainer}>
        {links.map((link) => (
          <div className={styles.linksContainerLink} key={link.name}>
            <Image
              className={styles.linkIcon}
              src={link.icon}
              alt={link.name}
            />
            <div role={"button"} onClick={link.onClick}>
              {link.name}
            </div>
          </div>
        ))}
      </div>
      <Image
        className={styles.separatorLine}
        src={SeparatorLine}
        alt="separator"
      />
    </div>
  );
}

export default function Home() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
