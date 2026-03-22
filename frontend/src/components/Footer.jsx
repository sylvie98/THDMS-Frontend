export default function Footer() {
  return (
    <footer className="bg-green-700 text-white mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 text-sm">
        
        <p>© {new Date().getFullYear()} THMDS</p>

        <p>Tea Harvest Management System</p>

        <p>Developed by Sylvie 💻</p>

      </div>
    </footer>
  );
}