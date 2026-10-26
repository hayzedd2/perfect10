import { Header } from "./header"
import { PerformanceHolder } from "./performance-holder/index"

export const App = () => {
  return (
    <div className="flex min-h-svh flex-col items-center bg-[#0f1318] px-4 py-8">
      <div className="w-full max-w-xl">
        <Header />
        <PerformanceHolder />
      </div>
    </div>
  )
}
