import Image from "next/image";
import Hero from "./components/Hero";
import ProblemSolution from "./components/ProblemSolution";

export default function Home() {
  return (
    <div>
      <Hero />
      <ProblemSolution />
    </div>
  );
}
