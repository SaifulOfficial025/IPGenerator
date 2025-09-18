import React, { useState, useEffect, useContext } from 'react';
import { IPGenContext } from '../../Context/IPGenContext';
import { Monitor, Mail, Phone, Zap, Shield, Database, ChevronRight, Globe, Code, Cpu } from 'lucide-react';

export default function IPGeneratorLanding() {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [animatingBg, setAnimatingBg] = useState(0);
  const [generatedData, setGeneratedData] = useState([
    { value: '', details: false, loading: false, redirect: '' },
    { value: '', details: false, loading: false, redirect: '' },
    { value: '', details: false, loading: false, redirect: '' }
  ]);
  const [copyStatus, setCopyStatus] = useState([
    { value: '', redirect: '' },
    { value: '', redirect: '' },
    { value: '', redirect: '' }
  ]);

  const { generateEmail, generatePhone, generateIP } = useContext(IPGenContext);
  const { useOtp } = useContext(IPGenContext);

  const demoData = [
    { type: 'IP', icon: Monitor },
    { type: 'Email', icon: Mail },
    { type: 'Phone', icon: Phone }
  ];

  // OTP box state
  const [otpPhone, setOtpPhone] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [otpStatus, setOtpStatus] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demoData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const bgInterval = setInterval(() => {
      setAnimatingBg((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(bgInterval);
  }, []);

  const handleGenerate = async (index) => {
    setGeneratedData((prev) => {
      const newData = [...prev];
      newData[index] = { ...newData[index], loading: true };
      return newData;
    });

    try {
      let value = '';
      if (demoData[index].type === 'IP') {
        const ipResult = await generateIP();
        // ipResult contains { generated_ip, redirect_url }
        value = ipResult.generated_ip || '';
        setGeneratedData((prev) => {
          const newData = [...prev];
          newData[index] = { ...newData[index], value, details: false, loading: false, redirect: ipResult.redirect_url || '' };
          return newData;
        });
        return;
      } else if (demoData[index].type === 'Email') {
        value = await generateEmail();
      } else if (demoData[index].type === 'Phone') {
        value = await generatePhone();
      }
      setGeneratedData((prev) => {
        const newData = [...prev];
        newData[index] = { ...newData[index], value, details: false, loading: false };
        return newData;
      });
    } catch (err) {
      setGeneratedData((prev) => {
        const newData = [...prev];
        newData[index] = { ...newData[index], loading: false };
        return newData;
      });
    }
  };

  const handleClear = (index) => {
    setGeneratedData((prev) => {
      const newData = [...prev];
      newData[index].value = '';
      newData[index].details = false;
      newData[index].redirect = '';
      return newData;
    });
  };

  const handleDetails = (index) => {
    setGeneratedData((prev) => {
      const newData = [...prev];
      newData[index].details = !newData[index].details;
      return newData;
    });
  };

  // Robust copy helper with fallback and visual feedback per-item
  const copyToClipboard = async (text, idx, field = 'value') => {
    if (!text) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopyStatus((prev) => {
        const next = prev.map((p) => ({ ...p }));
        next[idx][field] = 'Copied!';
        return next;
      });
      setTimeout(() => {
        setCopyStatus((prev) => {
          const next = prev.map((p) => ({ ...p }));
          next[idx][field] = '';
          return next;
        });
      }, 1500);
    } catch (err) {
      // ignore, optionally show error
      setCopyStatus((prev) => {
        const next = prev.map((p) => ({ ...p }));
        next[idx][field] = 'Error';
        return next;
      });
      setTimeout(() => {
        setCopyStatus((prev) => {
          const next = prev.map((p) => ({ ...p }));
          next[idx][field] = '';
          return next;
        });
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-cyan-900/30"></div>
        <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div
              key={i}
              className={`border-blue-400/10 border-r border-b transition-all duration-1000 ${
                animatingBg === i % 4 ? 'bg-cyan-400/5' : ''
              }`}
              style={{
                animationDelay: `${(i % 12) * 0.1}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              IP Generator
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#demo" className="hover:text-cyan-400 transition-colors">Demo</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-32">
        <div className="text-center mb-16">
          <h1 className="font-sans text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent leading-tight">
            Generate Random
            <br />
            <span className="font-sans bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Tech Data
            </span>
          </h1>
          <p className="font-sans text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Professional-grade random IP addresses, emails, and phone numbers for development, testing, and prototyping
          </p>
          {/* Only Documentation button remains */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="group border border-cyan-400/50 hover:border-cyan-400 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-cyan-400/10 flex items-center">
              <Code className="mr-2 w-5 h-5" />
              View Documentation
            </button>
          </div>
        </div>

        {/* Live Demo Section */}
        <div className="mb-24 relative">
          {/* Interactive glow effect behind demo */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-blue-400/10 to-purple-400/5 rounded-3xl blur-xl"></div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-cyan-400/20 p-8 max-w-2xl mx-auto relative">
            <h3 className="text-2xl font-bold text-center mb-6 text-cyan-300">Live Generator</h3>
            <div className="space-y-6">
              {demoData.map((demo, index) => {
                const Icon = demo.icon;
                const info = generatedData[index].value;
                const showDetails = generatedData[index].details;
                const isLoading = generatedData[index].loading;
                return (
                  <div
                    key={demo.type}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-500 relative overflow-hidden ${
                      currentDemo === index
                        ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20'
                        : 'border-gray-600 bg-gray-800/50 hover:bg-gray-700/50'
                    }`}
                    onClick={() => setCurrentDemo(index)}
                  >
                    <div className="flex items-center space-x-3 mb-4 relative z-10">
                      <Icon className={`w-6 h-6 transition-all duration-300 ${currentDemo === index ? 'text-cyan-400 animate-pulse' : 'text-gray-400'}`} />
                      <span className="font-semibold text-lg">{demo.type}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center w-full mb-4 relative">
                      {isLoading ? (
                        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-10">
                          <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-2" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
                          <div className="text-cyan-400 text-sm font-bold">Generating...</div>
                        </div>
                      ) : (
                        <div className="font-mono text-base md:text-2xl bg-black/50 px-4 py-3 rounded text-left w-full flex items-center gap-4">
                          {demo.type === 'Email' ? (
                            <div className="min-w-0 break-words whitespace-normal text-cyan-100" title={info || ''}>
                              {info || '--'}
                            </div>
                          ) : (
                            <div className="min-w-0 truncate md:max-w-[70%] break-words text-cyan-100" title={info || ''}>{info || '--'}</div>
                          )}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              type="button"
                              className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded text-sm hover:bg-cyan-500/30"
                              onClick={(e) => { e.stopPropagation(); copyToClipboard(info, index, 'value'); }}
                            >
                              {copyStatus[index].value || 'Copy'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* If this is the IP demo, show redirect_url box below */}
                    {demo.type === 'IP' && generatedData[index].redirect ? (
                      <div className="mt-3 w-full">
                        <div className="text-xs text-gray-400 mb-2">Redirect URL</div>
                        <div className="flex items-center bg-black/40 px-4 py-2 rounded gap-4">
                          <div className="min-w-0 break-words text-sm text-cyan-200 max-w-[70%]">{generatedData[index].redirect}</div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              type="button"
                              className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded text-sm hover:bg-cyan-500/30"
                              onClick={(e) => { e.stopPropagation(); window.open(generatedData[index].redirect, '_blank'); }}
                            >
                              Open
                            </button>
                            <button
                              type="button"
                              className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded text-sm hover:bg-cyan-500/30"
                              onClick={(e) => { e.stopPropagation(); copyToClipboard(generatedData[index].redirect, index, 'redirect'); }}
                            >
                              {copyStatus[index].redirect || 'Copy'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    <div className="flex items-center gap-3 relative z-10">
                      <button
                        className={`px-4 py-2 rounded bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold text-sm transition-all duration-300 hover:from-cyan-400 hover:to-blue-500 ${info ? 'bg-gradient-to-r from-red-400 to-red-600 text-white' : ''}`}
                        onClick={(e) => { e.stopPropagation(); info ? handleClear(index) : handleGenerate(index); }}
                      >
                        {info ? 'Clear' : 'Generate'}
                      </button>
                      <button
                        className="px-4 py-2 rounded border border-cyan-400/50 text-cyan-400 font-semibold text-sm transition-all duration-300 hover:bg-cyan-400/10"
                        onClick={(e) => { e.stopPropagation(); handleDetails(index); }}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                );
              })}
              {/* OTP Use Box */}
              <div className="flex flex-col items-center justify-center p-4 rounded-xl border bg-gray-800/50 transition-all duration-500">
                <div className="flex items-center space-x-3 mb-4">
                  <Phone className="w-6 h-6 text-gray-400" />
                  <span className="font-semibold text-lg">Use OTP</span>
                </div>
                <div className="w-full mb-3">
                  <input
                    type="text"
                    placeholder="+447723456789"
                    className="w-full bg-black/40 px-4 py-2 rounded text-sm text-white"
                    value={otpPhone}
                    onChange={(e) => setOtpPhone(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={!otpPhone || otpLoading}
                    className={`px-4 py-2 rounded text-black font-semibold text-sm ${!otpPhone || otpLoading ? 'bg-gray-600/40 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-blue-600'}`}
                    onClick={async () => {
                      if (!otpPhone) return;
                      setOtpLoading(true);
                      setOtpMessage('');
                      setOtpStatus('');
                      const res = await useOtp(otpPhone);
                      setOtpLoading(false);
                      setOtpMessage(res.message || 'No response');
                      setOtpStatus(res.status || (res.message ? 'success' : 'error'));
                    }}
                  >
                    {otpLoading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
                {otpMessage ? (
                  <div className={`mt-3 text-sm ${otpStatus === 'error' ? 'text-red-400' : 'text-cyan-200'}`}>{otpMessage}</div>
                ) : null}
              </div>
            </div>
            {/* Interactive progress indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {demoData.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentDemo === index ? 'bg-cyan-400 w-8' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  onClick={() => setCurrentDemo(index)}
                ></button>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mb-24">
          <h2 className="font-sans text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Generate thousands of valid data points in milliseconds with optimized algorithms"
              },
              {
                icon: Shield,
                title: "Production Ready",
                description: "Fully validated outputs that work in real-world applications and testing environments"
              },
              {
                icon: Database,
                title: "Multiple Formats",
                description: "Support for various IP ranges, email domains, and international phone number formats"
              },
              {
                icon: Cpu,
                title: "Smart Generation",
                description: "Intelligent algorithms ensure realistic and properly formatted data every time"
              },
              {
                icon: Globe,
                title: "Global Support",
                description: "Generate data for different regions and countries with proper formatting standards"
              },
              {
                icon: Code,
                title: "Developer Friendly",
                description: "Clean API, extensive documentation, and multiple integration options"
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-400/10"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-lg flex items-center justify-center mb-4 group-hover:from-cyan-400/30 group-hover:to-blue-400/30 transition-all">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="text-center mb-24">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { number: "10M+", label: "Data Points Generated" },
              { number: "99.9%", label: "Accuracy Rate" },
              { number: "<100ms", label: "Average Response Time" }
            ].map((stat, index) => (
              <div key={stat.label} className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-cyan-400/20">
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-12 border border-cyan-400/20">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Generating?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join thousands of developers using IP Generator for their projects
          </p>
          <button className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-10 py-4 rounded-xl font-semibold text-black transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 flex items-center mx-auto">
            Get Started Now
            <Zap className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-black" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              IP Generator
            </span>
          </div>
          <p className="text-gray-400">
            © 2025 IP Generator. Built for developers, by developers.
          </p>
        </div>
      </footer>
    </div>
  );
}