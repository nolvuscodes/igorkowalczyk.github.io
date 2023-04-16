import { ImageResponse } from "next/server";
import { parseISO } from "/lib/utils";

export const runtime = "edge";

const fontPoppinsBold = fetch(new URL("/public/fonts/bold.ttf", import.meta.url)).then((res) => res.arrayBuffer());

export async function GET(request) {
 const { title, date } = Object.fromEntries(new URL(request.url.replaceAll("&amp%3B", "&")).searchParams.entries());

 if (title && title.length > 50)
  return new Response("Title is too long. Please keep it under 50 characters.", {
   status: 400,
   headers: {
    "Content-Type": "text/json",
   },
  });

 if (date && !new Date(date).getTime())
  return new Response("Date is invalid. Please use a valid date.", {
   status: 400,
   headers: {
    "Content-Type": "text/json",
   },
  });

 if (date && new Date(date).getTime() > new Date().getTime())
  return new Response("Date is invalid. Please use a date in the past.", {
   status: 400,
   headers: {
    "Content-Type": "text/json",
   },
  });

 const fontBold = await fontPoppinsBold;

 return new ImageResponse(
  (
   <div
    style={{
     height: "100%",
     width: "100%",
     display: "flex",
     flexDirection: "column",
     alignItems: "center",
     justifyContent: "center",
     backgroundColor: "rgb(4, 13, 33)",
     fontFamily: "Poppins",
     fontSize: 64,
     fontWeight: 900,
     background: "linear-gradient(278.7deg, rgba(0, 0, 0, 0) 21.11%, rgba(0, 134, 245, 0.15) 137.25%), linear-gradient(98.7deg, rgba(4, 13, 33, 0.1) 60%, rgba(160, 68, 255, 0.1) 100%)",
    }}
   >
    <div style={{ color: "#fff", fontFamily: "Poppins" }}>{title ? title : ""}</div>
    <div
     style={{
      color: "rgba(255, 255, 255, 0.5)",
      fontFamily: "Popins",
      fontSize: 48,
      marginTop: "15px",
     }}
    >
     {date ? parseISO(date) : ""}
    </div>
   </div>
  ),
  {
   width: 1200,
   height: 630,
   fonts: [
    {
     name: "Poppins",
     data: fontBold,
     style: "normal",
     weight: 900,
    },
   ],
  }
 );
}
