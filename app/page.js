import { auth } from "@/auth";
import Game from "@/components/Game";

export default async function Page() {
  const session = await auth();
  return <Game authenticated={Boolean(session)} />;
}
