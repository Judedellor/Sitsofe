import { PropertyForm } from "@/components/properties/PropertyForm"

export default function NewPropertyPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Property</h1>
      <PropertyForm />
    </div>
  )
}
