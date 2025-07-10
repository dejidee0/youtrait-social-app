"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GlowButton } from "@/components/ui/glow-button";
import { TraitBubble } from "@/components/ui/trait-bubble";
import { Sparkles, Users, Heart } from "lucide-react";

const demoTraits = [
  { id: 1, word: "Creative", upvotes: 15, category: "mind" },
  { id: 2, word: "Kind", upvotes: 23, category: "heart" },
  { id: 3, word: "Funny", upvotes: 18, category: "social" },
  { id: 4, word: "Smart", upvotes: 12, category: "mind" },
  { id: 5, word: "Loyal", upvotes: 20, category: "heart" },
  { id: 6, word: "Energetic", upvotes: 8, category: "social" },
];

export function HeroSection() {
  const [particles, setParticles] = useState([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  useEffect(() => {
    if (!hasMounted) return;
    const generated = Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      x: Math.random() * 400 - 200,
      y: Math.random() * 400 - 200,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
    setParticles(generated);
  }, [hasMounted]);

  return (
    <section className="relative pt-24 md:pt-0 min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Background glows */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center lg:justify-start gap-2 mb-6"
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">
                Discover Your True Self
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Who Are You...{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Really?
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 mb-8 max-w-2xl"
            >
              Let the world decide. Showcase your personality through traits,
              reactions & stories. Build your unique trait cloud and discover
              what makes you... you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/auth">
                <GlowButton size="lg" className="group">
                  <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Get My Trait Cloud
                </GlowButton>
              </Link>
              <GlowButton variant="outline" size="lg">
                <Heart className="w-5 h-5" />
                Watch Demo
              </GlowButton>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center lg:justify-start gap-8 mt-12"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-400">Traits Shared</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">2.5K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-sm text-gray-400">Approval Rate</div>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT INTERACTIVE TRAIT CLOUD */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-96 lg:h-[500px]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Central Avatar */}
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity },
                }}
                className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/50"
              >
                <span className="text-white font-bold text-xl">You</span>
              </motion.div>

              {/* Orbiting Traits */}
              {demoTraits.map((trait, index) => {
                const angle = index * 60 * (Math.PI / 180);
                const radius = 120 + (index % 2) * 40;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <motion.div
                    key={trait.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: [x, x + 10, x],
                      y: [y, y - 10, y],
                    }}
                    transition={{
                      delay: index * 0.2,
                      x: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                      y: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.5,
                      },
                    }}
                    className="absolute"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                  >
                    <TraitBubble trait={trait} interactive={false} size="sm" />
                  </motion.div>
                );
              })}
            </div>

            {/* Floating Particles */}
            {/* Only render particles after mount */}
            {hasMounted &&
              particles.map((p, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full"
                  animate={{
                    x: [0, p.x],
                    y: [0, p.y],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: p.duration,
                    repeat: Infinity,
                    delay: p.delay,
                  }}
                  style={{
                    left: `${p.left}%`,
                    top: `${p.top}%`,
                  }}
                />
              ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
