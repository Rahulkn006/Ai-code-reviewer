"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Editor from "@monaco-editor/react";
import { CheckCircle, AlertTriangle, Info, Terminal, FileText, Activity } from "lucide-react";

type Bug = {
  type: string;
  severity: "Critical" | "Warning" | "Info";
  message: string;
};

type Metrics = {
  complexity: string;
  readability: string;
  maintainability: string;
};

export type AnalysisResult = {
  score: number;
  summary: string;
  bugs: Bug[];
  suggestions: string[];
  refactored_code: string;
  documentation: string;
  metrics: Metrics;
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ResultsDisplay({ result }: { result: AnalysisResult }) {
  if (!result) return null;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-4xl mx-auto mt-8 space-y-6"
    >
      {/* Score and Summary */}
      <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6">
        <Card className="col-span-1 border-primary/20 bg-card hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Quality Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-foreground">
              {result.score}<span className="text-2xl text-muted-foreground">/10</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">
              {result.summary}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Metrics */}
      {result.metrics && (
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
          {[
            { label: "Complexity", val: result.metrics?.complexity ?? "N/A" },
            { label: "Readability", val: result.metrics?.readability ?? "N/A" },
            { label: "Maintainability", val: result.metrics?.maintainability ?? "N/A" }
          ].map(m => (
            <Card key={m.label} className="border-border bg-card">
              <CardContent className="p-4 flex flex-col justify-center items-center text-center">
                <h4 className="text-xs text-muted-foreground uppercase tracking-wider">{m.label}</h4>
                <p className="text-sm sm:text-base font-semibold text-foreground mt-1">{m.val}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Bugs */}
      {result.bugs && result.bugs.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Detected Issues
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.bugs.map((bug, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-3 items-start p-3 rounded-lg bg-background/50 border border-border">
                  <Badge variant={bug.severity === "Critical" ? "destructive" : "secondary"} className="mt-0.5">
                    {bug.severity}
                  </Badge>
                  <div>
                    <h5 className="font-semibold text-foreground text-sm">{bug.type}</h5>
                    <p className="text-muted-foreground text-sm">{bug.message}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Suggestions */}
      {result.suggestions && result.suggestions.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Improvements & Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.suggestions.map((s, idx) => (
                  <li key={idx} className="flex gap-3 text-foreground text-sm">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Refactored Code */}
      {result.refactored_code && (
        <motion.div variants={itemVariants}>
          <Card className="border-border bg-card overflow-hidden">
            <CardHeader className="bg-background/50 border-b border-border">
              <CardTitle className="text-lg flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary" />
                Refactored Code
              </CardTitle>
            </CardHeader>
            <div className="h-[400px] w-full">
              <Editor
                height="100%"
                theme="vs-dark"
                defaultLanguage="typescript"
                value={result.refactored_code}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 16 }
                }}
              />
            </div>
          </Card>
        </motion.div>
      )}

      {/* Documentation */}
      {result.documentation && (
        <motion.div variants={itemVariants}>
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none text-sm text-foreground">
                <p className="whitespace-pre-wrap">{result.documentation}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
