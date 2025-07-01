import { jwtDecode } from "jwt-decode";

type DecodedIdToken = {
  email?: string;
  name?: string;
  nickname?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
};

export function getUserInfoFromIdToken(idToken: string): DecodedIdToken | null {
  try {
    const decoded: DecodedIdToken = jwtDecode(idToken);
    return decoded;
  } catch (error) {
    console.error("Failed to decode id_token", error);
    return null;
  }
}
