import { Bookmark, CrossIcon, Heart, Share } from "lucide-react";
import { FaCheck, FaComment, FaHome, FaMoon, FaSpinner, FaSun, FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { HiBars3 } from "react-icons/hi2";
import EmojiIcon from "./reactIcons";

export const Icons = {
  // home: FaHome,
  user: FaUser,
  sun: FaSun,
  moon: FaMoon,
  logo: FaUser,
  ham: HiBars3,
  reaction: Heart,
  comment: FaComment,
  save: Bookmark,
  share: Share,
  spinner: FaSpinner,
  close: CrossIcon,
  check: FaCheck,
  // settings: IoMdSettings,
  
  // Multiple emoji icons
  profile: () => <EmojiIcon emoji="😊" />,
  settings: () => <EmojiIcon emoji="⚙️" />,
  notification: () => <EmojiIcon emoji="🔔" />,
  account: () => <EmojiIcon emoji="🏢" />,
  home: () => <EmojiIcon emoji="🏠" />,
  thumbsUp: () => <EmojiIcon emoji="👍" />,
};
