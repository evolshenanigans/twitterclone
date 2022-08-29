import { ArrowPathIcon, HomeIcon } from "@heroicons/react/24/outline";
import {useState} from "react";
import { Tweet } from "../typings";
import { fetchTweets } from "../utils/fetchTweets";
import TweetBox from "./TweetBox";
import TweetComponent from '../components/Tweet'
import toast from "react-hot-toast";

interface Props {
  tweets: Tweet[];
}

function Feed({tweets: tweetsProp }: Props) {
  const [tweets, setTweets] = useState<Tweet[]>(tweetsProp);

  const handleRefresh = async () => {
    const refreshToast = toast.loading("Refreshing tweets...");

    const tweets = await fetchTweets()
    setTweets(tweets)

    toast.success("Tweets refreshed!", {
      id: refreshToast,
      });
  }


  return (
    <div className="col-span-7 max-h-screen overflow-scroll border-x scrollbar-hide lg:col-span-5">
      <div className="flex items-center justify-between">
        <h1 className="p-5 pb-0 text-xl font-bold">Home</h1>
        <ArrowPathIcon
          onClick={handleRefresh}
          className="mr-5 mt-5 h-8 w-8 
        cursor-pointer text-twitter 
        transition-all duration-500 ease-out
        hover:rotate-180 active:scale-125"
        />
      </div>
      {/* tweetbox */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <TweetBox setTweets={setTweets} />
      </div>
      {/* feed */}
      <div>
        {tweets.map(tweet => (
          <TweetComponent  key={tweet._id} tweet={tweet}/>
        ))}
      </div>
    </div>
  );
}

export default Feed;
