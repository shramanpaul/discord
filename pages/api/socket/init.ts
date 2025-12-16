import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";

export const config = {
  api: {
    bodyParser: false
  }
};

export default function handler(_req: NextApiRequest, res: NextApiResponseServerIo) {
  // This endpoint ensures the Socket.IO server initialization logic runs
  // without conflicting with the socket.io polling/websocket path.
  res.statusCode = 200;
  res.end("ok");
}
