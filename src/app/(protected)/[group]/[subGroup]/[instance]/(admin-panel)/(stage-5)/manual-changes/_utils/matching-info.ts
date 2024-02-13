function getUpdatedProfile(profile: number[], prevIdx: number, newIdx: number) {
  if (prevIdx === newIdx) return profile;

  return profile.map((num, i) => {
    if (i === prevIdx) return profile[prevIdx] - 1;
    if (i === newIdx) return profile[newIdx] + 1;
    else return num;
  });
}

function getUpdatedWeight(profile: number[]) {
  return profile.reduce((acc, val, i) => {
    return acc + val * (i + 1);
  }, 0);
}

export function handleProfileChange(
  profile: number[],
  prevIdx: number,
  newIdx: number,
  setProfile: (profile: number[]) => void,
  setWeight: (weight: number) => void,
) {
  if (prevIdx === newIdx) return;

  const updatedProfile = getUpdatedProfile(profile, prevIdx, newIdx);
  const updatedWeight = getUpdatedWeight(updatedProfile);

  setWeight(updatedWeight);
  setProfile(updatedProfile);
}
