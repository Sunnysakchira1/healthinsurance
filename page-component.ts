import InsuranceCalculator from '@/components/insurance-calculator'

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto">
        <InsuranceCalculator />
      </div>
    </main>
  )
}
