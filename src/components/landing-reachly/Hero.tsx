import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle, Play, Terminal } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-32 lg:py-40">
      {/* Animated background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
          <motion.div 
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-br from-brand/20 via-transparent to-orange-500/10"
          />
        </div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-slate-300 backdrop-blur-sm"
            >
              <span className="mr-2 h-2 w-2 rounded-full bg-brand animate-pulse"></span>
              Pre-delivery website QA
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl font-display leading-tight"
            >
              The QA backend
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-orange-400">
                to ship confidently.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-400 sm:text-xl leading-relaxed max-w-xl"
            >
              Reachly opens your site like a real user, tests pages, links, forms, buttons, mobile responsiveness and technical errors — then tells you exactly what needs fixing.
            </motion.p>

            {/* Command line snippet */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 text-sm font-mono text-slate-300">
                <Terminal className="h-4 w-4 text-brand" />
                <span className="text-slate-500">$</span>
                <span>reachly test https://acme.com</span>
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col gap-4 sm:flex-row sm:gap-4"
            >
              <Link 
                to="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-brand px-8 py-4 text-lg font-medium text-white hover:bg-brand-hover transition-all hover:scale-105 shadow-lg shadow-brand/25"
              >
                Test your site
              </Link>
              <Link 
                to="/signup"
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900/50 px-8 py-4 text-lg font-medium text-white hover:bg-slate-800 transition-all backdrop-blur-sm"
              >
                Get a demo
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-6 text-sm text-slate-400"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Zero false positives</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Visual evidence</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>5-min reports</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Admin Panel Mockup */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="relative rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl shadow-black/50 backdrop-blur-xl overflow-hidden"
            >
              {/* Window header */}
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 bg-slate-950/50">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="ml-4 text-sm font-medium text-slate-400">Reachly Dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded bg-success/10 px-2 py-1">
                    <span className="text-xs font-medium text-success">Live</span>
                  </div>
                </div>
              </div>

              {/* Admin content */}
              <div className="p-6 space-y-6">
                {/* Site info */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white font-display">acme.com</h3>
                    <p className="text-sm text-slate-400">QA Report #1847</p>
                  </div>
                  <motion.div 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.3 }}
                    className="rounded-lg bg-brand/10 border border-brand/20 px-3 py-1"
                  >
                    <span className="text-sm font-medium text-brand">Complete</span>
                  </motion.div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Pages", value: "31", color: "text-white" },
                    { label: "Checks", value: "184", color: "text-white" },
                    { label: "Issues", value: "4", color: "text-danger" }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                      className="rounded-lg border border-slate-800 bg-slate-950/50 p-3"
                    >
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-slate-400">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Results */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-300">Test Results</h4>
                  <div className="space-y-2">
                    {[
                      { label: "169 passed", status: "success", count: 169 },
                      { label: "11 warnings", status: "warning", count: 11 },
                      { label: "4 critical", status: "error", count: 4 }
                    ].map((result, index) => (
                      <motion.div
                        key={result.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                        className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/30 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          {result.status === "success" && <CheckCircle className="h-4 w-4 text-success" />}
                          {result.status === "warning" && <AlertTriangle className="h-4 w-4 text-warning" />}
                          {result.status === "error" && <XCircle className="h-4 w-4 text-danger" />}
                          <span className="text-sm text-slate-300">{result.label}</span>
                        </div>
                        <span className={`text-sm font-medium ${
                          result.status === "success" ? "text-success" : 
                          result.status === "warning" ? "text-warning" : "text-danger"
                        }`}>
                          {result.count}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Critical issue detail */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0, duration: 0.3 }}
                  className="rounded-lg border border-danger/20 bg-danger/5 p-4"
                >
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-danger mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-danger">Critical Issue Detected</p>
                      <p className="text-xs text-slate-400 mt-1">POST /api/contact → HTTP 500</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button className="flex items-center gap-1 rounded bg-danger/10 px-2 py-1 text-xs text-danger hover:bg-danger/20 transition-colors">
                          <Play className="h-3 w-3" />
                          View evidence
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Floating elements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -right-4 top-1/4 rounded-lg border border-slate-800 bg-slate-900/90 px-4 py-2 shadow-xl backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-slate-300">Testing in progress</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}