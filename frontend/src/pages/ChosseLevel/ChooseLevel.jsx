import styles from './ChooseLevel.module.css'
import { useParams } from 'react-router-dom'
import TitleBox from "../../components/TitleBox/TitleBox";
import useWindowWidth from '../../hooks/useWindowWidth';
import Tooltip from '../../components/Tooltip/Tooltip';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext';
import { useGame } from '../../contexts/gameContext';

 function MapLevels({
  levels = [],
  onSelect = (fase) => console.log("Fase:", fase),
}) {
  const total = levels.length
  const width = useWindowWidth();

  const scale = width/1920
  const nodes = [];
  const spacingX = 300;
  const spacingY = 300;
  const nodeSize = 130;
  const borderWidth = 15;
  const svgWidth = (total/2-1)>0?((Math.round(total/2)-1) * spacingX + nodeSize + borderWidth ):spacingX + nodeSize + borderWidth


  for (let i = 0; i < total; i++) {
    const x = nodeSize/2 + borderWidth + (Math.floor(i/2) * spacingX);
    const y = i % 4 === 0 || i % 4 === 3? nodeSize/2 + borderWidth:nodeSize/2 + borderWidth + spacingY; // zig-zag

    nodes.push({ id: i + 1, x, y });
  }

  const createPath = (a, b) => {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;

    return `M${a.x*scale} ${a.y*scale} Q ${(mx)*scale} ${(my - 50)*scale} ${b.x*scale} ${b.y*scale}`;
  };

  return (
    <svg width={svgWidth/10+'rem'} height="50rem">
      {nodes.map((node, i) => {
        if (i === 0) return null;
        const prev = nodes[i - 1];

        return (
          <path
            key={`path-${i}`}
            d={createPath(prev, node)}

            stroke="black"
            strokeWidth="4rem"
            strokeDasharray="1.5rem 1rem"
            fill="none"
          />
        );
      })}

      {nodes.map((node, i) => (
        <g key={node.id} onClick={() => onSelect(levels[i].id)} style={{ cursor: "pointer" }}>
          <Tooltip text={levels[i].label + ' - ' +levels[i].maxReached + ' / '+ levels[i].max + ' pontos'}>
            {({ onMouseEnter, onMouseLeave, onMouseMove }) => (
              <rect
                className={styles.rect + (levels[i].maxReached >= levels[i].max ? ` ${styles.maximazed}` : levels[i].maxReached > 0 ? ` ${styles.alreadyPlayed}` : ` `)}
                x={(node.x - 75)/10+"rem"}
                y={(node.y - 75)/10+"rem"}
                width="13rem"
                height="13rem"
                rx="1.2rem"
                stroke="black"
                fill="var(--primary-dark)"
                strokeWidth="1.5rem"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseMove={onMouseMove}
              />
            )}
          </Tooltip>

          <text
            className={styles.levelNumber + (levels[i].maxReached >= levels[i].max ? ` ${styles.maximazed}` :``)}
            x={(node.x-10)/10+"rem"}
            y={(node.y + 24)/10+"rem"}
            textAnchor="middle"
            fontSize="9.6rem"
            fontWeight="bold"
            
          >
            {levels[i].number}
          </text>
        </g>
      ))}
    </svg>
  );
}

function fetchLevelsFromWorld(worldId){
  return fetch(import.meta.env.VITE_API_URL + "/level/world/"+worldId, {
    method: "GET",
    credentials: "include",
  })
    .then(async (response) => {
      const data = await response.json();

      if (data.error) {
        console.error(data.error);
        throw new Error("Erro ao buscar levels:", data.error);
      }
      
      return data.data;
    })
    .catch((error) => {
      throw new Error("Erro ao buscar levels:", error);
    });
  }
  
  function fetchUserLevels(userId, worldId){
    return fetch(import.meta.env.VITE_API_URL + "/user/levels/"+userId+"?world="+worldId, {
      method: "GET",
      credentials: "include",
    })
  .then(async (response) => {
    const data = await response.json();
    
    if (data.error) {
      console.error(data.error);
      throw new Error("Erro ao buscar user levels:", data.error);
      }
      
      return data.data;
    })
    .catch((error) => {
      throw new Error("Erro ao buscar user levels:", error);
    });
}

function mergeLevelsWithUserProgress(levels, userLevels){
  const userLevelsMap = new Map();
  userLevels.forEach(ul => {
    userLevelsMap.set(ul.id_level, ul);
  });

  return levels.map(level => {
    const userLevel = userLevelsMap.get(level.id);
    return {
      ...level,
      maxReached: userLevel ? userLevel.max_points : 0,
      max: level.totalWeight
    };
  });
}

async function loadLevels(worldId, userId){
  try{
    const [levels, userLevels] = await Promise.all([
      fetchLevelsFromWorld(worldId),
      fetchUserLevels(userId, worldId)
    ]);
    
    return mergeLevelsWithUserProgress(levels, userLevels);
  }catch(e){
    console.error(e)
    throw e
  } 
}
export default function ChooseLevel(){
  const { user } = useAuth();
  const { startLevel, startRandom } = useGame();
  console.log(user)
  const [useIsLoading, setUseIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const { world } = useParams();
  async function fetchData() {
    setUseIsLoading(true);
    const userId = user.id;
    setIsError(false);
    try{
      const levelsWithProgress = await loadLevels(world, userId)
      setLevels(levelsWithProgress);
      setUseIsLoading(false);
      setIsError(false);
    }catch(e){
      setIsError(true);
    }finally{
      setUseIsLoading(false);
    }
  }
  useEffect(() => {

    fetchData();
  }, [world]);
  
  const [levels, setLevels] = useState([])
  return <div className={styles.chooseLevel}>
    <div className={styles.levels}>
      <TitleBox title={"Fases"}></TitleBox>
    </div>
    {
      isError? 
      <div className={styles.error}>Erro ao carregar as fases. <button onClick={fetchData}>Recarregar</button></div> :
      useIsLoading? 
      <div className={styles.loading}>Carregando...</div> :
      <MapLevels levels={levels} onSelect={(id)=>startLevel(id)}></MapLevels>
    }
    
  </div>
}