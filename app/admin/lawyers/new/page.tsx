import LawyerForm from "../LawyerForm";

export default function NewLawyerPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Lawyer</h1>
        <p className="mt-2 text-gray-600">Create a new attorney profile</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <LawyerForm />
      </div>
    </div>
  );
}
