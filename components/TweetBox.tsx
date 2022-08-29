import React, { Dispatch, MouseEvent, SetStateAction, useRef, useState } from "react";
import {
  MagnifyingGlassCircleIcon,
  FaceSmileIcon,
  CalendarIcon,
  MapPinIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { Tweet, TweetBody } from "../typings";
import { fetchTweets } from "../utils/fetchTweets";
import toast from "react-hot-toast";

interface Props {
  setTweets: Dispatch<SetStateAction<Tweet[]>>
}

function TweetBox({ setTweets}: Props) {
  const [input, setInput] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const [imageUrlBoxIsOpen, setImageUrlBoxIsOpen] = useState<boolean>(false);

  const postTweet = async () => {
    const tweetInfo: TweetBody = {
      text: input,
      username: session?.user?.name || "Unknown User",
      profileImg: session?.user?.image || "https://images.squarespace-cdn.com/content/v1/5e0e65adcd39ed279a0402fd/1627422661797-QIMOL76SO962XLBHNZDU/7.jpg?format=2500w",
      image: image,
    };
    
    const result = await fetch(`/api/addTweet`, {
      body: JSON.stringify(tweetInfo),
      method: "POST",
    })
    
    const json = await result.json();
    const newTweets = await fetchTweets();
    setTweets(newTweets);
    
    toast("Tweet posted!", {
      icon: "🐦",
    });
    return json;
  };
  const handleSubmit = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => {
      e.preventDefault();
      
      postTweet();
      
      setInput("");
      
      setImage("");
      setImageUrlBoxIsOpen(false);
    };
    const addImageToTweet = (
      e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => {
      e.preventDefault();
  
      if (!imageInputRef.current?.value) return;
  
      setImage(imageInputRef.current.value);
      imageInputRef.current.value = "";
      setImageUrlBoxIsOpen(false);
    };
    
  return (
    <div className="flex space-x-2 p-5">
      <img
        className="h-14 w-14 rounded-full object-cover mt-4"
        src={
          session?.user?.image ||
          "https://www.itdp.org/wp-content/uploads/2021/06/avatar-man-icon-profile-placeholder-260nw-1229859850-e1623694994111.jpg"
        }
        alt=""
      />
      <div className="flex flex-1 items-center pl-2">
        <form className="flex flex-1 flex-col">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-24 w-full text-xl outline-none placeholder:text-xl"
            type="text"
            placeholder={session ? "whats happening?" : "sign in to tweet"}
          />
          <div className="flex items-center">
            <div className="flex space-x-2 text-twitter flex-1">
              <PhotoIcon
                onClick={() => setImageUrlBoxIsOpen(!imageUrlBoxIsOpen)}
                className="h-5 w-5 cursor-pointer transition-transform duration-150 ease-out
              hover:scale-150"
              />
              <MagnifyingGlassCircleIcon className="h-5 w-5" />
              <FaceSmileIcon className="h-5 w-5" />
              <CalendarIcon className="h-5 w-5" />
              <MapPinIcon className="h-5 w-5" />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!input || !session}
              className="bg-twitter px-5 py-2 font-bold 
             text-white rounded-full disabled:opacity-40"
            >
              Tweet
            </button>
          </div>
          {imageUrlBoxIsOpen && (
            <form className="mt-5 flex rounded-lg bg-twitter/80 py-2 px-4">
              <input
                ref={imageInputRef}
                className="flex-1 bg-transparent p-2 text-white outline-none placeholder:text-white"
                type="text"
                placeholder="Enter Image URL..."
              />
              <button
                type="submit"
                onClick={addImageToTweet}
                className="font-bold text-white"
              >
                Add Image
              </button>
            </form>
          )}
          {image && (
            <img
              src={image}
              alt=""
              className="mt-10 h-40 w-full rounded-xl object-contain shadow-lg"
            />
          )}
        </form>
      </div>
    </div>
  );
}

export default TweetBox;
