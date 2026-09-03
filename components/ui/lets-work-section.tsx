"use client"

import type React from "react"

import { useState } from "react"
import { ArrowUpRight, Mail, ArrowLeft, Phone } from "lucide-react"

type ContactMethod = 'mail' | 'phone' | 'linkedin'

const LinkedinIcon = ({ className, strokeWidth = 2, style }: { className?: string, strokeWidth?: number, style?: React.CSSProperties }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

export function LetsWorkTogether() {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const [contactMethod, setContactMethod] = useState<ContactMethod>('mail')

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setIsClicked(true)

    setTimeout(() => {
      setShowSuccess(true)
    }, 500)
  }

  const handleConnect = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (contactMethod === 'mail') window.open("https://mail.google.com/mail/?view=cm&fs=1&to=niloyjana2005@gmail.com", "_blank")
    else if (contactMethod === 'phone') window.location.href = "tel:+919876543210"
    else if (contactMethod === 'linkedin') window.open("https://www.linkedin.com/in/niloy-jana/", "_blank")
  }

  return (
    <section className="flex items-center justify-center px-6 w-full h-full pointer-events-none">
      <div className="relative w-full h-full pointer-events-none">
        <div
          className="absolute inset-0 z-10 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: showSuccess ? 1 : 0,
            transform: showSuccess ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
            pointerEvents: showSuccess ? "auto" : "none",
          }}
        >
          {/* Elegant heading */}
          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 w-full pointer-events-none">
            <span
              className="text-xs font-medium tracking-[0.3em] uppercase text-white/60 transition-all duration-500"
              style={{
                transform: showSuccess ? "translateY(0)" : "translateY(10px)",
                opacity: showSuccess ? 1 : 0,
                transitionDelay: "100ms",
              }}
            >
              Perfect
            </span>
            <h3
              className="text-3xl font-light tracking-tight text-white transition-all duration-500 sm:text-4xl"
              style={{
                transform: showSuccess ? "translateY(0)" : "translateY(10px)",
                opacity: showSuccess ? 1 : 0,
                transitionDelay: "200ms",
              }}
            >
              Let's talk
            </h3>
          </div>


          {/* Connect button */}
          <div 
            className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 group/connect flex items-center"
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            {/* Invisible Hover Bridge to keep menu open while moving mouse */}
            <div className="absolute -inset-y-20 -left-24 right-0 z-[-1] hidden group-hover/connect:block" />

            <div
              onClick={handleConnect as any}
              className="relative flex items-center gap-4 transition-all duration-500 cursor-pointer"
              style={{
                transform: showSuccess
                  ? isButtonHovered
                    ? "translateY(0) scale(1.02)"
                    : "translateY(0) scale(1)"
                  : "translateY(15px) scale(1)",
                opacity: showSuccess ? 1 : 0,
                transitionDelay: "150ms",
              }}
            >
              {/* Left line */}
              <div
                className="h-px w-8 bg-white/40 transition-all duration-500 sm:w-12"
                style={{
                  transform: isButtonHovered ? "scaleX(0)" : "scaleX(1)",
                  opacity: isButtonHovered ? 0 : 0.5,
                }}
              />

              {/* Button content */}
              <div
                className="relative flex items-center gap-3 rounded-full border px-6 py-3 transition-all duration-500 sm:px-8 sm:py-4 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
                style={{
                  borderColor: isButtonHovered ? "white" : "rgba(255,255,255,0.2)",
                  backgroundColor: isButtonHovered ? "white" : "rgba(255,255,255,0.1)",
                  boxShadow: isButtonHovered ? "0 0 30px rgba(255,255,255,0.2), 0 10px 40px rgba(255,255,255,0.1)" : "none",
                }}
              >
                {/* Fan-out Contact Options */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Phone - Top Left */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setContactMethod('phone'); }}
                    className="absolute -top-12 -left-8 sm:-top-16 sm:-left-12 size-12 sm:size-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110 opacity-0 scale-50 group-hover/connect:opacity-100 group-hover/connect:scale-100 pointer-events-none group-hover/connect:pointer-events-auto shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] z-10"
                  >
                    <Phone className="size-5 text-white" />
                  </button>
                  {/* LinkedIn - Middle Left */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setContactMethod('linkedin'); }}
                    className="absolute top-1/2 -translate-y-1/2 -left-16 sm:-left-20 size-12 sm:size-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110 opacity-0 scale-50 group-hover/connect:opacity-100 group-hover/connect:scale-100 pointer-events-none group-hover/connect:pointer-events-auto shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] z-10 delay-75"
                  >
                    <LinkedinIcon className="size-5 text-white" />
                  </button>
                  {/* Mail - Bottom Left */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setContactMethod('mail'); }}
                    className="absolute -bottom-12 -left-8 sm:-bottom-16 sm:-left-12 size-12 sm:size-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110 opacity-0 scale-50 group-hover/connect:opacity-100 group-hover/connect:scale-100 pointer-events-none group-hover/connect:pointer-events-auto shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] z-10 delay-150"
                  >
                    <Mail className="size-5 text-white" />
                  </button>
                </div>
                {contactMethod === 'mail' && (
                  <Mail className="size-4 transition-all duration-500 sm:size-5" strokeWidth={1.5} style={{ color: isButtonHovered ? "black" : "white" }} />
                )}
                {contactMethod === 'phone' && (
                  <Phone className="size-4 transition-all duration-500 sm:size-5" strokeWidth={1.5} style={{ color: isButtonHovered ? "black" : "white" }} />
                )}
                {contactMethod === 'linkedin' && (
                  <LinkedinIcon className="size-4 transition-all duration-500 sm:size-5" strokeWidth={1.5} style={{ color: isButtonHovered ? "black" : "white" }} />
                )}
                
                {/* Vertical Separator */}
                <div 
                  className="w-px h-5 bg-white/20 transition-colors duration-500"
                  style={{ backgroundColor: isButtonHovered ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)" }}
                />

                <span
                  className="text-sm font-medium tracking-wide transition-all duration-500 sm:text-base"
                  style={{
                    color: isButtonHovered ? "black" : "white",
                  }}
                >
                  Connect
                </span>
                <ArrowUpRight
                  className="size-4 transition-all duration-500 sm:size-5"
                  strokeWidth={1.5}
                  style={{
                    color: isButtonHovered ? "black" : "white",
                    transform: isButtonHovered ? "translate(3px, -3px) scale(1.1)" : "translate(0, 0) scale(1)",
                  }}
                />
              </div>

              {/* Right line */}
              <div
                className="h-px w-8 bg-white/40 transition-all duration-500 sm:w-12"
                style={{
                  transform: isButtonHovered ? "scaleX(0)" : "scaleX(1)",
                  opacity: isButtonHovered ? 0 : 0.5,
                }}
              />
            </div>
          </div>

          {/* Back button */}
          <div className="absolute top-[70%] left-1/2 -translate-x-1/2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsClicked(false)
                setShowSuccess(false)
              }}
              className="group relative flex size-12 sm:size-14 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] transition-all duration-500 hover:bg-white/20 hover:border-white/50 hover:scale-110 cursor-pointer"
            >
              <ArrowLeft className="size-4 text-white transition-transform duration-500 group-hover:-translate-x-1" />
            </button>
          </div>
        </div>



        <div
          className="absolute top-[10%] left-1/2 -translate-x-1/2 w-full flex flex-col items-center pointer-events-none"
        >
            <h2
              className="text-center w-full text-5xl font-light tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: isClicked ? 0 : 1,
                transform: isClicked ? "translateY(-40px) scale(0.95)" : "translateY(0) scale(1)",
              }}
            >
              <span className="block overflow-hidden pb-4 -mb-4">
                <span
                  className="block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    transform: isHovered && !isClicked ? "translateY(-8%)" : "translateY(0)",
                  }}
                >
                  Let's work
                </span>
              </span>
              <span className="block overflow-hidden pb-4 -mb-4">
                <span
                  className="block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-75"
                  style={{
                    transform: isHovered && !isClicked ? "translateY(-8%)" : "translateY(0)",
                  }}
                >
                  <span className="text-white/80">together</span>
                </span>
              </span>
            </h2>
        </div>

        <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div 
              className="relative flex size-20 items-center justify-center sm:size-24 cursor-pointer pointer-events-auto group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={(e) => handleClick(e as unknown as React.MouseEvent<HTMLAnchorElement>)}
            >
              {/* Invisible expanded hit area to prevent hover jitter */}
              <div className="absolute -inset-4 z-[-1]" />

              <div
                className="pointer-events-none absolute inset-0 rounded-full border transition-all ease-out backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
                style={{
                  borderColor: isClicked ? "white" : isHovered ? "white" : "rgba(255,255,255,0.2)",
                  backgroundColor: isClicked ? "transparent" : isHovered ? "white" : "rgba(255,255,255,0.1)",
                  transform: isClicked ? "scale(3)" : isHovered ? "scale(1.05)" : "scale(1)",
                  opacity: isClicked ? 0 : 1,
                  transitionDuration: isClicked ? "700ms" : "500ms",
                }}
              />
              <ArrowUpRight
                className="size-7 transition-all ease-[cubic-bezier(0.16,1,0.3,1)] sm:size-8"
                style={{
                  transform: isClicked
                    ? "translate(100px, -100px) scale(0.5)"
                    : isHovered
                      ? "translate(2px, -2px)"
                      : "translate(0, 0)",
                  opacity: isClicked ? 0 : 1,
                  color: isHovered && !isClicked ? "black" : "white",
                  transitionDuration: isClicked ? "600ms" : "500ms",
                }}
              />
            </div>

          <div className="absolute -left-8 top-1/2 -translate-y-1/2 sm:-left-16">
            <div
              className="h-px w-8 bg-white/40 transition-all duration-500 sm:w-12"
              style={{
                transform: isClicked ? "scaleX(0) translateX(-20px)" : isHovered ? "scaleX(1.5)" : "scaleX(1)",
                opacity: isClicked ? 0 : isHovered ? 1 : 0.5,
              }}
            />
          </div>
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 sm:-right-16">
            <div
              className="h-px w-8 bg-white/40 transition-all duration-500 sm:w-12"
              style={{
                transform: isClicked ? "scaleX(0) translateX(20px)" : isHovered ? "scaleX(1.5)" : "scaleX(1)",
                opacity: isClicked ? 0 : isHovered ? 1 : 0.5,
              }}
            />
          </div>
        </div>

        <div
          className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-full max-w-md flex flex-col items-center gap-4 text-center transition-all duration-500 delay-100 pointer-events-none"
          style={{
            opacity: isClicked ? 0 : 1,
            transform: isClicked ? "translateY(20px)" : "translateY(0)",
            pointerEvents: isClicked ? "none" : "auto",
          }}
        >
          <p className="max-w-md text-sm leading-relaxed text-white/80">
            As an aspiring engineer, I'm always looking for new challenges. Whether you have a project to launch or a team to grow, I'd love to connect!
          </p>
        </div>
      </div>
    </section>
  )
}
