import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex justify-center mt-10">
        <div className="text-center p-6">
          <h1 className="text-5xl font-bold mb-4 animate-fadeIn">
            Welcome to my LMA <sub>(Loan Management Platform)</sub> Platform
          </h1>
          <p className="text-lg opacity-80 mb-6 animate-slideUp">
            Here are some stats about my platform to get you excited:
            <div className="flex justify-center">
              <ul className="list-disc list-inside text-left text-sm">
                <li>Built with my favorite stack.</li>
                <li>Trusted by mostly me!</li>
                <li>Over 9000 lines of code... I didn&apos;t count though.</li>
              </ul>
            </div>
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4 animate-fadeIn">
        <Link
          href="/loan-list-page"
          className="px-6 py-3 rounded-lg font-medium shadow-lg bg-yellow-500 text-black transition-all duration-300 hover:bg-yellow-400 hover:shadow-xl active:scale-95"
          style={{ backgroundColor: "rgb(250, 204, 21)" }} // Fallback color (yellow-500)
        >
          Go to Loans
        </Link>
      </div>
    </>
  );
}
