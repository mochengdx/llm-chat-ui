import FormBuilder from "./FormBuilder";

export default function App() {
  const handlePublish = (schema: any) => {
    console.log("Published Schema:", schema);
    alert("Schema Published! Check console.");
  };

  return (
    <div className="h-screen w-screen bg-gray-50 overflow-hidden">
      <FormBuilder onPublish={handlePublish} />
    </div>
  );
}
