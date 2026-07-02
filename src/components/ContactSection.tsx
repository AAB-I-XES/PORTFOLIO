import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Mail, MapPin, Feather, CheckCircle2, Trash2, Palette, Code2, Heart } from "lucide-react";

interface SavedMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  stampIdx: number;
  date: string;
}

const POSTCARD_STAMPS = [
  { icon: Heart, name: "Soft Pink Rose", color: "text-rose-500" },
  { icon: Palette, name: "Art Palette", color: "text-[#e05050]" },
  { icon: Code2, name: "Code Ink", color: "text-[#141414]" },
  { icon: Mail, name: "Air Mail", color: "text-blue-500" }
];

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [selectedStamp, setSelectedStamp] = useState(0);

  const [savedMessages, setSavedMessages] = useState<SavedMessage[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Load saved messages on mount
  useEffect(() => {
    const saved = localStorage.getItem("dibya_portfolio_messages");
    if (saved) {
      try {
        setSavedMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse messages");
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    const newMessage: SavedMessage = {
      id: Date.now().toString(),
      name,
      email,
      message,
      stampIdx: selectedStamp,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    };

    const updated = [newMessage, ...savedMessages];
    setSavedMessages(updated);
    localStorage.setItem("dibya_portfolio_messages", JSON.stringify(updated));

    // Show success state
    setIsSuccess(true);
    setName("");
    setEmail("");
    setMessage("");

    // Clear success banner after 4s
    setTimeout(() => {
      setIsSuccess(false);
    }, 4000);
  };

  const deleteMessage = (id: string) => {
    const updated = savedMessages.filter((msg) => msg.id !== id);
    setSavedMessages(updated);
    localStorage.setItem("dibya_portfolio_messages", JSON.stringify(updated));
  };

  return (
    <section
      id="contact"
      className="min-h-screen w-full relative py-20 px-6 md:px-12 bg-[#f5f2ed] border-t border-[#141414]/10 overflow-hidden"
    >
      {/* Background sketch lines */}
      <div className="absolute inset-0 sketch-grid-dark opacity-10 pointer-events-none" />

      {/* Section Indicator Header */}
      <div className="max-w-7xl mx-auto w-full mb-12 flex justify-between items-center border-b border-[#141414]/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#141414]/50 font-bold uppercase tracking-wider">
            05 / CONTACT
          </span>
          <span className="font-display font-black text-lg tracking-wider text-[#141414] uppercase">
            Let's build together
          </span>
        </div>
        <span className="font-mono text-[10px] tracking-widest text-[#141414]/50 uppercase hidden sm:inline">
          [ GET IN TOUCH ]
        </span>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        
        {/* LEFT COLUMN: THE POSTCARD FORM */}
        <div className="lg:col-span-7">
          <div className="bg-white border-2 border-[#141414] rounded-2xl shadow-[6px_6px_0px_#141414] overflow-hidden p-6 md:p-8 relative">
            
            {/* Postcard Center Vertical Divider line (on md+ screens) */}
            <div className="absolute top-0 bottom-0 left-[55%] w-[1.5px] bg-[#141414]/10 hidden md:block border-r border-dashed border-[#141414]/10" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Form Side (Postcard Left) */}
              <form onSubmit={handleSubmit} className="md:col-span-6 space-y-5">
                <div className="border-b border-[#141414]/10 pb-3">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#141414]/50">
                    SAY HELLO
                  </span>
                  <h3 className="font-display font-black text-xl text-[#141414] tracking-tight uppercase">
                    Write Message
                  </h3>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label htmlFor="user-name" className="font-mono text-[9px] uppercase text-[#141414]/60 font-bold">Your Name</label>
                  <input
                    id="user-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ada Lovelace"
                    className="w-full bg-[#f5f2ed]/55 border border-[#141414]/15 rounded-lg px-3 py-2 text-xs font-sans text-[#141414] placeholder-[#141414]/45 focus:outline-hidden focus:border-[#141414] transition-all font-semibold"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="user-email" className="font-mono text-[9px] uppercase text-[#141414]/60 font-bold">Your Email Address</label>
                  <input
                    id="user-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ada@computing.org"
                    className="w-full bg-[#f5f2ed]/55 border border-[#141414]/15 rounded-lg px-3 py-2 text-xs font-sans text-[#141414] placeholder-[#141414]/45 focus:outline-hidden focus:border-[#141414] transition-all font-semibold"
                  />
                </div>

                {/* Message Body */}
                <div className="space-y-1">
                  <label htmlFor="user-msg" className="font-mono text-[9px] uppercase text-[#141414]/60 font-bold">Message Narrative</label>
                  <textarea
                    id="user-msg"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your design and software plans..."
                    className="w-full bg-[#f5f2ed]/55 border border-[#141414]/15 rounded-lg px-3 py-2 text-xs font-sans text-[#141414] placeholder-[#141414]/45 focus:outline-hidden focus:border-[#141414] transition-all resize-none font-semibold"
                  />
                </div>

                {/* Stamp Selector */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase text-[#141414]/60 block font-bold">Postal Stamp</label>
                  <div className="flex gap-2">
                    {POSTCARD_STAMPS.map((stamp, idx) => {
                      const StampIcon = stamp.icon;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedStamp(idx)}
                          className={`flex-1 py-2 px-1 border-2 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                            selectedStamp === idx
                              ? "border-[#141414] bg-[#fcebeb] scale-105 shadow-sm"
                              : "border-[#141414]/10 hover:border-[#141414]/30 bg-white"
                          }`}
                          title={stamp.name}
                        >
                          <StampIcon className={`w-5 h-5 ${stamp.color}`} />
                          <span className="text-[7px] font-mono mt-1.5 tracking-tight font-bold">{stamp.name.split(" ")[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full border-2 border-[#141414] bg-[#141414] text-[#f5f2ed] hover:bg-[#ffd6e0] hover:text-[#141414] transition-all duration-300 font-mono text-xs tracking-widest uppercase font-black cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Postcard</span>
                </button>
              </form>

              {/* Stamp & Address side (Postcard Right) */}
              <div className="md:col-span-6 space-y-8 md:pl-8 flex flex-col justify-between h-full pt-4 md:pt-0">
                
                {/* Stamp visual slot */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="font-mono text-[8px] uppercase tracking-wider text-[#141414]/40 block">
                      STAMP DETAILS
                    </span>
                    <span className="font-display font-black text-xs text-[#141414] uppercase">
                      Guwahati // 2026
                    </span>
                  </div>

                  {/* Stamp Display Frame */}
                  <div className="w-16 h-20 border border-dashed border-[#141414]/40 rounded-lg flex flex-col items-center justify-center p-1 bg-[#fcebeb] rotate-3 relative shadow-xs">
                    {React.createElement(POSTCARD_STAMPS[selectedStamp].icon, { 
                      className: `w-6 h-6 ${POSTCARD_STAMPS[selectedStamp].color}` 
                    })}
                    <span className="font-mono text-[7px] text-[#141414]/50 mt-2.5 uppercase text-center font-bold">
                      POSTAGE
                    </span>
                  </div>
                </div>

                {/* Hand-addressed fields */}
                <div className="space-y-4">
                  <div className="font-mono text-[9px] uppercase tracking-wider text-[#141414]/40 border-b border-[#141414]/10 pb-1">
                    Contact Details
                  </div>

                  {/* Field 1 */}
                  <div className="flex items-center gap-2.5 border-b border-[#141414]/25 py-1">
                    <Mail className="w-4 h-4 text-[#141414]/60" />
                    <span className="font-serif italic text-xs text-[#141414] select-text font-bold">
                      rabhadibyajyoti05@gmail.com
                    </span>
                  </div>

                  {/* Field 2 */}
                  <div className="flex items-center gap-2.5 border-b border-[#141414]/25 py-1">
                    <MapPin className="w-4 h-4 text-[#141414]/60" />
                    <span className="font-serif italic text-xs text-[#141414] select-text font-bold">
                      Guwahati, Assam, India
                    </span>
                  </div>

                  {/* Field 3 */}
                  <div className="flex items-center gap-2.5 border-b border-[#141414]/25 py-1">
                    <Feather className="w-4 h-4 text-[#141414]/60" />
                    <span className="font-serif italic text-xs text-[#141414] font-bold">
                      Developer, Designer &amp; Illustrator
                    </span>
                  </div>
                </div>

                {/* Success Announcement Frame */}
                <AnimatePresence>
                  {isSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-start gap-2 text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Postcard Stamped!</span>
                        <p className="font-light mt-0.5 font-semibold">Your message has been filed successfully inside client-side storage below.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT visitor MAILBOX MESSAGES */}
        <div className="lg:col-span-5 space-y-4">
          <div className="font-mono text-[10px] tracking-widest text-[#141414]/50 uppercase pb-2 border-b border-[#141414]/5">
            SENT MESSAGES (LOCAL ARCHIVE)
          </div>

          <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-2">
            {savedMessages.length > 0 ? (
              savedMessages.map((msg) => {
                const MsgIcon = POSTCARD_STAMPS[msg.stampIdx]?.icon || Mail;
                const iconColor = POSTCARD_STAMPS[msg.stampIdx]?.color || "text-[#141414]";
                return (
                  <div
                    key={msg.id}
                    className="bg-white border-2 border-[#141414]/15 rounded-xl p-4 space-y-2 relative shadow-xs group"
                  >
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <MsgIcon className={`w-4 h-4 ${iconColor}`} />
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        className="p-1 rounded hover:bg-[#fcebeb] hover:text-red-600 text-[#141414]/30 transition-colors cursor-pointer"
                        title="Delete message entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  <div className="space-y-0.5">
                    <h4 className="font-display font-black text-xs text-[#141414] uppercase">
                      {msg.name}
                    </h4>
                    <span className="font-mono text-[8px] text-[#141414]/50 block">
                      {msg.email} &bull; {msg.date}
                    </span>
                  </div>

                  <p className="font-sans text-xs text-[#141414]/85 bg-[#f5f2ed]/50 p-2 rounded border border-[#141414]/5 whitespace-pre-wrap leading-relaxed select-text font-semibold">
                    {msg.message}
                  </p>
                </div>
                );
              })
            ) : (
              <div className="border-2 border-dashed border-[#141414]/15 rounded-xl p-8 text-center bg-white/40">
                <span className="font-mono text-[10px] text-[#141414]/40 tracking-widest uppercase">
                  [ MAILBOX EMPTY. LEAVE A COMMENT ABOVE! ]
                </span>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
