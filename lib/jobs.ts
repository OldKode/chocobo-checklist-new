export const JOB_OPTIONS = [
  "Paladin",
  "Warrior",
  "Dark Knight",
  "Gunbreaker",
  "White Mage",
  "Scholar",
  "Astrologian",
  "Monk",
  "Dragoon",
  "Ninja",
  "Samurai",
  "Reaper",
  "Bard",
  "Machinist",
  "Dancer",
  "Black Mage",
  "Summoner",
  "Red Mage",
  "Pictomancer",
  "Blue Mage",
  "Carpenter",
  "Blacksmith",
  "Armorer",
  "Goldsmith",
  "Leatherworker",
  "Weaver",
  "Alchemist",
  "Culinarian",
  "Miner",
  "Botanist",
  "Fisher",
] as const;

const TANK_JOBS = new Set(["Paladin", "Warrior", "Dark Knight", "Gunbreaker"]);
const CRAFTER_GATHERER_JOBS = new Set([
  "Carpenter",
  "Blacksmith",
  "Armorer",
  "Goldsmith",
  "Leatherworker",
  "Weaver",
  "Alchemist",
  "Culinarian",
  "Miner",
  "Botanist",
  "Fisher",
]);

export function isTankJob(job: string) {
  return TANK_JOBS.has(job);
}

export function isCrafterGatherer(job: string) {
  return CRAFTER_GATHERER_JOBS.has(job);
}
