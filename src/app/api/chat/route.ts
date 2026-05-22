import { NextRequest, NextResponse } from "next/server";
import { runAgent } from "@/lib/ai/agent";
import { runProactiveChecks } from "@/lib/ai/proactive";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Run the agent
    const response = await runAgent(message, history || []);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Agent error:", error);
    return NextResponse.json({ error: "Failed to process agent request" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // A separate endpoint to trigger proactive checks
    const result = await runProactiveChecks();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Proactive check error:", error);
    return NextResponse.json({ error: "Failed to run proactive checks" }, { status: 500 });
  }
}
