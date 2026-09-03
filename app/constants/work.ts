import * as THREE from "three";
import { WorkTimelinePoint } from "../types";

export const WORK_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(0, 0, 0),
    year: '2008-2021',
    title: 'South Point High School',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-4, -4, -3),
    year: '2023-2027',
    title: 'St Thomas College of Engineering and Technology',
    subtitle: 'B.Tech CSE',
    position: 'left',
    subtitleOffset: -2.0,
  },
  {
    point: new THREE.Vector3(-3, -1, -6),
    year: 'Mar-May 2026',
    title: 'Pratinik Infotech',
    subtitle: 'Artificial Intelligence Intern',
    details: 'Predictive Maintenance ML Pipeline\n\nEngineered time-series features (rolling stats, lag variables, degradation trends) from sensor data and applied anomaly detection to achieve ~89% failure-prediction accuracy, reducing equipment downtime by ~30%. Built a real-time monitoring pipeline with an interactive health-metrics dashboard, using feature importance analysis to surface key failure-driving signals.',
    position: 'left',
  },
  {
    point: new THREE.Vector3(0, -1, -10),
    year: 'Apr-Jul 2026',
    title: 'KreupAi Technologies',
    subtitle: 'AI/ML Engineer Intern',
    details: 'AISA — Multi-Agent LLM Platform\n\nOrchestrated 25 AI agents — including an AI AP Officer and AI QA Coordinator — to automate enterprise finance and QA workflows. Built an NLP-driven invoice processing agent (~75% reduction in manual processing) and a RAG pipeline using pgvector for semantic search, alongside a standalone FastAPI server exposing core agent functionality.',
    position: 'left',
  },
  {
    point: new THREE.Vector3(1, 1, -12),
    year: 'PRESENT',
    title: 'Aspiring AI Engineer',
    subtitle: 'Building the future',
    details: "I'm Niloy Jana, a Computer Science undergrad and an aspiring AI engineer. My foundation is core CS — I'm just as comfortable building full-stack web applications as I am designing AI systems — and over the past year that's pulled me toward multi-agent LLM systems and RAG pipelines specifically. I've moved from coursework into real production experience: building and orchestrating multi-agent systems, working with retrieval-augmented generation, and shipping computer vision models that hold up outside a notebook. I like owning a system end-to-end, from the reasoning logic down to how it actually runs in production.",
    position: 'right',
  }
]