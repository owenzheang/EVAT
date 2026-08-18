import NavBar from "../components/NavBar";
import ChatBubble from "../components/ChatBubble";
import SupportRequestForm from "../components/SupportRequestForm";
import backgroundImage from "../assets/background.jpg";

import '../styles/Buttons.css';
import '../styles/Elements.css';
import '../styles/NavBar.css';
import '../styles/Validation.css';

export default function ContactSupport() {
  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-[#172235] text-white">
      <NavBar />
      {/* background */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="fixed inset-0 -z-10 bg-[#172235]/70" />

      <main className="mx-auto w-full max-w-2xl px-4 py-5 sm:px-5 sm:py-6">
        {/* cards */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <section className="rounded-lg bg-[#62d48c] p-3 text-center text-black shadow-md sm:p-4">
            <h5 className="mb-1.5 text-lg font-bold">Call Us</h5>
            <p className="text-sm">1-800-XXX-XXXX</p>
            <p className="text-sm">Mon–Fri, 9AM – 6PM (EST)</p>
          </section>

          <section className="rounded-lg bg-[#62d48c] p-3 text-center text-black shadow-md sm:p-4">
            <h5 className="mb-1.5 text-lg font-bold">Email Us</h5>
            <p className="text-sm">support@domain.com</p>
            <p className="text-sm">tech@domain.com</p>
          </section>

          <section className="rounded-lg bg-[#62d48c] p-3 text-center text-black shadow-md sm:p-4 md:col-span-2 md:w-1/2 md:justify-self-center lg:col-span-1 lg:w-full">
            <h5 className="mb-1.5 text-lg font-bold">Mailing Address</h5>
            <p className="text-sm">123 Green Drive</p>
            <p className="text-sm">Clean City, ST 00000</p>
          </section>
        </div>

        {/* form */}
        <SupportRequestForm />
      </main>

      <div className="[&>button]:fixed [&>button]:right-5 [&>button]:bottom-5 [&>button]:z-[1000] [&>button]:flex [&>button]:size-[70px] [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border-0 [&>button]:bg-[#62d48c] [&>button]:text-white [&>button]:shadow-lg [&>button]:transition-transform [&>button]:duration-200 [&>button:hover]:scale-110">
        <ChatBubble />
      </div>
    </div>
  );
}
