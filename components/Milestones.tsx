"use client";

import {
  Sprout,
  Star,
  Trophy,
  Crown,
  Lock,
  Check,
  Leaf,
} from "lucide-react";

type MilestoneTrackerProps = {
  points?: number;
};

const milestones = [
  { points: 0, title: "Getting Started", icon: Sprout },
  { points: 100, title: "Healthy Habit", icon: Leaf },
  { points: 250, title: "On a Roll!", icon: Sprout },
  { points: 500, title: "Meal Master", icon: Trophy },
  { points: 1000, title: "Nutrition Pro", icon: Crown },
];

const challenges = [ /* maybe needs numcurr and numneeded? */
    { points: 50, desc: "Try 2 different cuisines", numCurr: 0, numNeeded: 2, icon: Sprout },
    { points: 75, desc: "Use 30 of your ingredients", numCurr: 18, numNeeded: 30, icon: Leaf },
    { points: 100, desc: "Share the app with a friend", numCurr: 1, numNeeded: 1, icon: Trophy },
    { points: 150, desc: "Use FridgeSnap 3 times in one week", numCurr: 1, numNeeded: 3, icon: Crown }
];

export default function Milestones({
  points = 920,
}: MilestoneTrackerProps) {
  const currentIndex = milestones.reduce(
    (index, milestone, i) =>
      points >= milestone.points ? i : index,
    0
  );

  const current = milestones[currentIndex];
  const next = milestones[currentIndex + 1];

  const progress = next
    ? Math.min(
        100,
        ((points - current.points) /
          (next.points - current.points)) *
          100
      )
    : 100;

  return (
    <section className="w-full rounded-3xl border border-gray-400 bg-white p-8 max-w-md mx-auto mt-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
            <Trophy size={26} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Challenge Rewards
            </h2>
            <p className="text-sm text-gray-500">
              Try new things!
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-green-50 px-3 py-2 font-semibold text-green-800">
          <Star size={17} className="fill-green-600 text-green-600" />
          <span>{points}</span>
          <span className="text-sm">pts</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-8">
        <div
          className="relative h-4 overflow-visible rounded-full bg-gray-100"
          role="progressbar"
          aria-label="Progress toward next milestone"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />

          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-green-100 p-2 text-green-700 shadow-sm"
            style={{ left: `${progress}%` }}
          >
            <Sprout size={20} />
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between gap-2 text-sm">
          <div>
            <p className="font-bold text-gray-900">
              {current.points} pts
            </p>
            <p className="text-gray-500">{current.title}</p>
          </div>

          {next ? (
            <div className="text-right">
              <p className="font-bold text-gray-900">
                {next.points} pts
              </p>
              <p className="text-gray-500">{next.title}</p>
            </div>
          ) : (
            <div className="text-right">
              <p className="font-bold text-green-700">
                All milestones reached!
              </p>
              <p className="text-gray-500">Amazing work</p>
            </div>
          )}
        </div>

        {next && (
          <p className="mt-3 text-sm text-gray-500">
            Only{" "}
            <span className="font-semibold text-green-700">
              {next.points - points} points
            </span>{" "}
            to your next milestone!
          </p>
        )}
      </div>

      {/* Milestone rewards */}
      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {challenges.map((challenge) => {
          const Icon = challenge.icon;
          const unlocked = challenge.numCurr >= challenge.numNeeded; /* depends on if challenge is completed */

          return (
            <div
              key={challenge.points}
              className={`relative rounded-2xl border p-3 ${
                unlocked
                  ? "border-green-100 bg-green-50"
                  : "border-gray-100 bg-gray-50"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    unlocked
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <Icon size={22} />
                </div>

                {unlocked ? (
                  <Check size={18} className="text-green-600" />
                ) : (
                  <p>{challenge.numCurr}/{challenge.numNeeded}</p>
                )}
              </div>

              <p className="text-sm font-bold text-gray-900">
                {challenge.points.toLocaleString()} pts
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {challenge.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}