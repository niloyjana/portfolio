import { useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import ProjectTile from "./ProjectTile";

import { PROJECTS } from "@constants";
import { usePortalStore } from "@stores";

/**
 * Carousel layout:
 *  - FOV spread: Math.PI (180°)
 *  - Circle radius: 13 units
 *  - Slot count: PROJECTS.length - 1 = 7  (FoodBridge shares slot 0 with AirForm)
 *  - FoodBridge (index 0): circleIndex=0, y=3.5  (elevated, floating above AirForm)
 *  - AirForm   (index 1): circleIndex=0, y=1
 *  - All others (index i): circleIndex=i-1, y=1
 */
const ProjectsCarousel = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const isActive = usePortalStore((state) => state.activePortalId === "projects");
  const activeId = isActive ? selectedId : null;

  const onClick = (id: number) => {
    if (!isMobile) return;
    setSelectedId(id === selectedId ? null : id);
  };

  const tiles = useMemo(() => {
    const fov = Math.PI;
    const distance = 13;
    // Number of arc slots = total projects minus the elevated FoodBridge duplicate
    const circleCount = PROJECTS.length - 1; // 7

    return PROJECTS.map((project, i) => {
      // FoodBridge (index 0) shares the same arc slot as AirForm (index 1)
      const circleIndex = i === 0 ? 0 : i - 1;

      const angle = (fov / circleCount) * circleIndex;
      const z = -distance * Math.sin(angle);
      const x = -distance * Math.cos(angle);
      const rotY = Math.PI / 2 - angle;

      // FoodBridge floats above AirForm; all other tiles sit at y=1
      const y = i === 0 ? 3.5 : 1;

      return (
        <ProjectTile
          key={i}
          project={project}
          index={i}
          position={[x, y, z]}
          rotation={[0, rotY, 0]}
          activeId={activeId}
          onClick={() => onClick(i)}
        />
      );
    });
  }, [activeId, isActive]);

  return (
    <group rotation={[0, -Math.PI / 12, 0]}>
      {tiles}
    </group>
  );
};

export default ProjectsCarousel;