"use client";

import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Editor from "@monaco-editor/react";
import { GitBranch, Code, Play, FileText, Upload } from "lucide-react";
import { useSession } from "next-auth/react";

export default function InputSection({ onAnalyze }: { onAnalyze: (type: string, payload: string) => void }) {
  const [activeTab, setActiveTab] = useState("code");
  const [code, setCode] = useState("// Paste your code here\n");
  const [language, setLanguage] = useState("typescript");
  const [githubUrl, setGithubUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    if (!session) {
      alert("Please login to analyze code.");
      return;
    }

    setLoading(true);
    try {
      if (activeTab === "code" && code.trim()) {
        await onAnalyze("code", `Language Context: ${language}\n\n${code}`);
      } else if (activeTab === "github" && githubUrl.trim()) {
        const res = await fetch("/api/github", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: githubUrl })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        await onAnalyze("github", `Language Context: ${language}\n\n${data.code}`);
      } else if (activeTab === "pdf" && pdfFile) {
        const formData = new FormData();
        formData.append("file", pdfFile);
        const res = await fetch("/api/pdf", {
          method: "POST",
          body: formData
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        await onAnalyze("pdf", `Language Context: ${language}\n\n${data.code}`);
      }
    } catch (err: any) {
      alert(`Processing Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = 
    loading || 
    (activeTab === "code" ? code.trim() === "" : false) ||
    (activeTab === "github" ? githubUrl.trim() === "" : false) ||
    (activeTab === "pdf" ? pdfFile === null : false) ||
    !session;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 border border-border rounded-xl bg-card overflow-hidden shadow-lg">
      <Tabs defaultValue="code" onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="code" className="gap-2">
              <Code className="w-4 h-4" /> Code
            </TabsTrigger>
            <TabsTrigger value="github" className="gap-2">
              <GitBranch className="w-4 h-4" /> GitHub
            </TabsTrigger>
            <TabsTrigger value="pdf" className="gap-2">
              <FileText className="w-4 h-4" /> PDF
            </TabsTrigger>
          </TabsList>
          
          <Button 
            onClick={handleAnalyze} 
            disabled={isDisabled}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2 transition-all"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
        </div>

        <TabsContent value="code" className="m-0 focus-visible:outline-none">
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20">
            <span className="text-sm font-medium text-muted-foreground mr-3">Language</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-background border border-border text-foreground text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50 w-[160px] shadow-sm transition-colors"
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="csharp">C#</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="php">PHP</option>
              <option value="ruby">Ruby</option>
              <option value="swift">Swift</option>
              <option value="kotlin">Kotlin</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="json">JSON</option>
              <option value="sql">SQL</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>
          <div className="h-[360px] w-full border-t border-border">
            <Editor
              height="100%"
              theme="vs-dark"
              language={language}
              value={code}
              onChange={(val) => setCode(val || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="github" className="m-0 focus-visible:outline-none p-8 h-[400px]">
          <div className="max-w-xl mx-auto space-y-4 pt-12">
            <h3 className="text-lg font-medium text-foreground text-center">
              Analyze a GitHub Repository
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              Paste the URL of a public GitHub repository. We will fetch and analyze the codebase.
            </p>
            <div className="relative pt-4">
              <GitBranch className="absolute left-3 top-7 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="https://github.com/user/repo" 
                className="pl-10 h-12 bg-background border-border"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pdf" className="m-0 focus-visible:outline-none p-8 h-[400px]">
          <div className="max-w-xl mx-auto space-y-4 pt-12">
            <h3 className="text-lg font-medium text-foreground text-center">
              Upload PDF Code Document
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              Upload a document with code. We will extract all readable text for analysis.
            </p>
            <div className="pt-4 flex flex-col items-center gap-4">
              <input 
                type="file" 
                accept="application/pdf" 
                className="hidden" 
                ref={fileInputRef}
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              />
              <Button 
                variant="outline" 
                className="gap-2 w-full h-12 border-dashed border-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4" />
                {pdfFile ? pdfFile.name : "Select PDF Document"}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
