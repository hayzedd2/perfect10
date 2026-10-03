import { Header } from "./header"
import { PerformanceHolder } from "./performance-holder"

export const App = () => {
  return (
    <div className="flex min-h-svh flex-col items-center bg-[#0f1318] px-4 py-8">
      <div className="w-full max-w-xl">
        <Header />

        <h2 className="mb-1 text-2xl  text-green-500">
          My 9 performances
        </h2>
        <p className="mb-6 text-sm text-white/50">
          The nine individual performances that live rent-free in your head. Tap
          a slot to add one, then save your grid to share!
        </p>

        <PerformanceHolder />
      </div>
    </div>
  )
}
