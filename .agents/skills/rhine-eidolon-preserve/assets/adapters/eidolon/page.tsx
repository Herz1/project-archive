// Project Archive adapter: replace backend entry data only; visual components stay upstream.
import { Landing } from "@/app/(landing)/Landing";
import fixture from "@/fixtures/landing.json";
import type { Character, LandingAssets, SignInOptions } from "@/lib/api";

export default function ReferenceLanding() {
  return (
    <Landing
      isSignedIn={false}
      characters={fixture.characters as Character[]}
      signInOptions={fixture.signInOptions as SignInOptions}
      assets={fixture.assets as LandingAssets}
    />
  );
}
