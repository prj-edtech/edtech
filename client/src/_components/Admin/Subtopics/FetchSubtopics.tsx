import { getAllSubtopics } from "@/api/subtopics";
import { useEffect, useState } from "react";

const FetchSubtopics = () => {
  const [data, setData] = useState<any[]>([]);

  const loadSubtopics = async () => {
    try {
      const response = await getAllSubtopics();
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadSubtopics();
  }, []);

  return (
    <>
      {/* {data.length === 0 ? (
        <h1>Subtopic data is empty</h1>
      ) : (
        <div>
          {data.map((subtopic) => (
            <h1 key={subtopic.id}>{subtopic.id}</h1>
          ))}
        </div>
      )} */}
    </>
  );
};

export default FetchSubtopics;
