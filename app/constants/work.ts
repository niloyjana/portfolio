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
    position: 'left',
  },
  {
    point: new THREE.Vector3(0, -1, -10),
    year: 'Apr-Jul 2026',
    title: 'KreupAi Technologies',
    subtitle: 'AI/ML Engineer Intern',
    position: 'left',
  },
  {
    point: new THREE.Vector3(1, 1, -12),
    year: 'PRESENT',
    title: 'Aspiring AI Engineer',
    subtitle: 'Building the future',
    position: 'right',
  }
]