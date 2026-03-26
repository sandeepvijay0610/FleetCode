// src/data/mockData.js

export const MOCK_SQUAD_STATS = { 
  name: "Tee-Toddlers", 
  score: 14250, 
  rank: 4, 
  streak: 12 
};

export const MOCK_SQUAD_MATES = ["Teammate_2", "Teammate_3", "Teammate_4"];

export const MOCK_LIVE_ACTIVITY = [
  { problem: "Two Sum", time: "2m ago" }, // username injected dynamically in component
  { user: "Teammate_2", problem: "LRU Cache", time: "1h ago" },
  { user: "Teammate_3", problem: "Valid Anagram", time: "4h ago" },
  { user: "Teammate_4", problem: "Rain Water", time: "12h ago" }
];

export const MOCK_TARGET_PAYLOAD = {
  id: "70", 
  name: "Climbing Stairs", 
  diff: "Easy", 
  xp: "+10 XP",
  weakness: "Dynamic Programming"
};

export const MOCK_LEADERBOARD = [
  {rank:1, name:"Byte Me", score:28400, streak:45},
  {rank:2, name:"Ctrl Alt Defeat", score:25100, streak:32},
  {rank:3, name:"Array of Hope", score:21050, streak:28},
  {rank:4, name:"Tee-Toddlers", score:14250, streak:12}
];

export const MOCK_RADAR_DB = {
  "Team": [{subject:'Arrays',A:120},{subject:'DP',A:40},{subject:'Trees',A:85},{subject:'Strings',A:110},{subject:'Math',A:90},{subject:'Graphs',A:65}],
  "Sandeep": [{subject:'Arrays',A:140},{subject:'DP',A:120},{subject:'Trees',A:90},{subject:'Strings',A:100},{subject:'Math',A:130},{subject:'Graphs',A:80}],
  "Teammate_2": [{subject:'Arrays',A:80},{subject:'DP',A:10},{subject:'Trees',A:40},{subject:'Strings',A:60},{subject:'Math',A:30},{subject:'Graphs',A:20}]
};