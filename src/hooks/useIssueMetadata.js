import { useState, useEffect } from 'react';
import axios from 'axios';

const getColorByName = (list = [], identifier, fallback = '#ccc') => {
  if (!Array.isArray(list) || identifier == null) {
    return fallback;
  }
  const byName = list.find(item => item.name === identifier);
  if (byName) return byName.color;
  const idNum = Number(identifier);
  if (!isNaN(idNum)) {
    const byId = list.find(item => item.id === idNum);
    if (byId) return byId.color;
  }
  return fallback;
};



export function useIssueMetadata() {
  const [tipus, setTipus] = useState([]);
  const [gravetat, setGravetat] = useState([]);
  const [prioritat, setPrioritat] = useState([]);
  const [estat, setEstat] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = 'https://issue-tracker-c802.onrender.com/api'


  useEffect(() => {
    const normalize = res => {
      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data.results)) return res.data.results;
      return [];
    };

    const fetchAll = async () => {
      try {
        const [tRes, gRes, pRes, eRes] = await Promise.all([
            axios.get(`${API}/tipus/`),
            axios.get(`${API}/severity/`),
            axios.get(`${API}/priorities/`),
            axios.get(`${API}/statuses/`)
        ])

        console.log('tipus:', tRes.data);
        console.log('gravetat:', gRes.data);
        console.log('prioritat:', pRes.data);
        console.log('estat:', eRes.data);

        setTipus(normalize(tRes));
        setGravetat(normalize(gRes));
        setPrioritat(normalize(pRes));
        setEstat(normalize(eRes));
      } catch (err) {
        console.error('Error cargando metadatos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return { loading, tipus, gravetat, prioritat, estat, getColorByName };
}
