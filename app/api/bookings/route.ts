import { NextRequest, NextResponse } from "next/server";
import { BookingSubmissionSchema } from "@/lib/validation/bookingSchema";
import { processBookingSubmission } from "@/lib/firestore/bookings";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request schema
    const validationResult = BookingSubmissionSchema.safeParse(body);
    if (!validationResult.success) {
      const errorIssues = validationResult.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      }));
      return NextResponse.json(
        {
          success: false,
          code: "VALIDATION_ERROR",
          message: errorIssues[0]?.message || "Invalid booking data provided",
          errors: errorIssues,
        },
        { status: 400 }
      );
    }

    const submission = validationResult.data;

    // Process booking atomically
    const result = await processBookingSubmission(submission);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          code: result.code || "BOOKING_FAILED",
          message: result.message || "Could not complete booking reservation.",
        },
        { status: result.code === "DATE_UNAVAILABLE" ? 409 : 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        bookingId: result.bookingId,
        totalPrice: result.totalPrice,
        isCustomQuote: result.isCustomQuote,
        message: result.message || "Booking request received successfully",
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Booking API error:", err);
    return NextResponse.json(
      {
        success: false,
        code: "INTERNAL_ERROR",
        message: "An error occurred while processing your request. Please try again.",
      },
      { status: 500 }
    );
  }
}
