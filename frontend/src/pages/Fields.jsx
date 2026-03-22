import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

// Sample static field data
const fields = [
  { id: 1, name: "Field A", owner: "Owner 1", size: "5 ha" },
  { id: 2, name: "Field B", owner: "Owner 2", size: "3 ha" },
  { id: 3, name: "Field C", owner: "Owner 3", size: "7 ha" },
  { id: 4, name: "Field D", owner: "Owner 1", size: "4 ha" },
];

export default function Fields() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <h1 className="text-3xl font-bold mb-6">Fields</h1>

          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Field Name</th>
                <th className="py-2 px-4">Owner</th>
                <th className="py-2 px-4">Size</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr key={field.id} className="text-center border-b">
                  <td className="py-2 px-4">{field.id}</td>
                  <td className="py-2 px-4">{field.name}</td>
                  <td className="py-2 px-4">{field.owner}</td>
                  <td className="py-2 px-4">{field.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}