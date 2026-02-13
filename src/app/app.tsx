import Navbar from "@/components/ui/navbar/navbar";
import Sidebar from "@/components/ui/sidebar/sidebar";
import Canvas from "@/components/ui/canvas/canvas";
import FeedbackPanel from "@/components/ui/feedback-panel/feedback-panel";

const App = () => {
  return (
    <main className="h-screen w-screen flex flex-col bg-white overflow-hidden">
      <Navbar />

      <section className="flex-1 flex flex-col sm:flex-row overflow-hidden">
        <Sidebar />
        <Canvas />
      </section>

      <FeedbackPanel />
    </main>
  );
};

export default App;
