import { fetchActiveBoards } from "@/api/boards";
import { getAllQuestionPaper } from "@/api/questionPapers";
import { getAllActiveSections } from "@/api/sections";
import { fetchActiveStandards } from "@/api/standards";
import { getAllSubjects } from "@/api/subjects";
import { getAllSubtopics } from "@/api/subtopics";
import { fetchAllActiveTopics } from "@/api/topics";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const AddQuestions = () => {
  const [loading, setLoading] = useState(false);

  const [boardData, setBoardData] = useState([]);
  const [boardId, setBoardId] = useState("");
  const [standardCode, setStandardCode] = useState([]);
  const [standardId, setStandardId] = useState("");
  const [subject, setSubject] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [qp, setQp] = useState([]);
  const [qpId, setQpId] = useState("");
  const [topicData, setTopicData] = useState([]);
  const [topicId, setTopicId] = useState("");
  const [sectionData, setSectionData] = useState([]);
  const [sectionId, setSectionId] = useState("");
  const [subtopicData, setSubtopicData] = useState([]);
  const [subTopicId, setsubTopicId] = useState("");

  const loadBoards = async () => {
    setLoading(true);
    try {
      const response = await fetchActiveBoards();
      setBoardData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadStandards = async () => {
    setLoading(true);
    try {
      const response = await fetchActiveStandards();
      setStandardCode(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const response = await getAllSubjects();
      setSubject(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadQuestionPaper = async () => {
    setLoading(true);
    try {
      const response = await getAllQuestionPaper();
      setQp(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async () => {
    setLoading(true);
    try {
      const response = await fetchAllActiveTopics();
      setTopicData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadSections = async () => {
    setLoading(true);
    try {
      const response = await getAllActiveSections();
      setSectionData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubtopics = async () => {
    setLoading(true);
    try {
      const response = await getAllSubtopics();
      setSubtopicData(response);
      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoards();
    loadStandards();
    loadSubjects();
    loadQuestionPaper();
    loadSections();
    loadTopics();
    loadSubtopics();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-start items-start w-full flex-col lg:gap-y-6 lg:px-10">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col gap-y-4 mt-4">
          <div>
            <Label className="mb-2">Board</Label>
            <Select
              value={boardId}
              onValueChange={(value) => setBoardId(value)}
            >
              <SelectTrigger className="lg:w-[240px] cursor-pointer">
                <SelectValue placeholder="Select a board" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {boardData.map((board) => (
                    <SelectItem key={board.id} value={board.sortKey}>
                      {board.sortKey}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-y-4 mt-4">
          <div>
            <Label className="mb-2">Standard</Label>
            <Select
              value={standardId}
              onValueChange={(value) => setStandardId(value)}
            >
              <SelectTrigger className="lg:w-[240px] cursor-pointer">
                <SelectValue placeholder="Select a standard" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {standardCode.map((standard) => (
                    <SelectItem key={standard.id} value={standard.sortKey}>
                      {standard.sortKey}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-y-4 mt-4">
          <div>
            <Label className="mb-2">Subject</Label>
            <Select
              value={subjectId}
              onValueChange={(value) => setSubjectId(value)}
            >
              <SelectTrigger className="lg:w-[240px] cursor-pointer">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {subject.map((sbj) => (
                    <SelectItem key={sbj.id} value={sbj.sortKey}>
                      {sbj.sortKey}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col gap-y-4 mt-4">
          <div>
            <Label className="mb-2">Section</Label>
            <Select
              value={sectionId}
              onValueChange={(value) => setSectionId(value)}
            >
              <SelectTrigger className="lg:w-[240px] cursor-pointer">
                <SelectValue placeholder="Select a section" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {sectionData.map((section) => (
                    <SelectItem key={section.id} value={section.sortKey}>
                      {section.sectionJson.attributes.displayName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-y-4 mt-4">
          <div>
            <Label className="mb-2">Topic</Label>
            <Select
              value={topicId}
              onValueChange={(value) => setTopicId(value)}
            >
              <SelectTrigger className="lg:w-[240px] cursor-pointer">
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {topicData.map((topic) => (
                    <SelectItem key={topic.id} value={topic.sortKey}>
                      {topic.topicJson.attributes.displayName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-y-4 mt-4">
          <div>
            <Label className="mb-2">Subtopic</Label>
            <Select
              value={subTopicId}
              onValueChange={(value) => setsubTopicId(value)}
            >
              <SelectTrigger className="lg:w-[240px] cursor-pointer">
                <SelectValue placeholder="Select a subtopic" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {subtopicData.map((subtopic) => (
                    <SelectItem key={subtopic.id} value={subtopic.sortKey}>
                      {subtopic.subTopicJson.attributes.displayName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col gap-y-4 mt-4">
          <div>
            <Label className="mb-2">Question Paper</Label>
            <Select value={qpId} onValueChange={(value) => setQpId(value)}>
              <SelectTrigger className="lg:w-[240px] cursor-pointer">
                <SelectValue placeholder="Select a question paper" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {qp.map((questionPapers) => (
                    <SelectItem
                      key={questionPapers.id}
                      value={questionPapers.id}
                    >
                      {questionPapers.attributes.type}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-y-4 mt-4">
          <div>
            <Label className="mb-2">Month</Label>
            <Select>
              <SelectTrigger className="lg:w-[240px] cursor-pointer">
                <SelectValue placeholder="Select a month" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="JAN">January</SelectItem>
                  <SelectItem value="FEB">February</SelectItem>
                  <SelectItem value="MAR">March</SelectItem>
                  <SelectItem value="APR">April</SelectItem>
                  <SelectItem value="MAY">May</SelectItem>
                  <SelectItem value="JUN">June</SelectItem>
                  <SelectItem value="JUL">July</SelectItem>
                  <SelectItem value="AUG">August</SelectItem>
                  <SelectItem value="SEP">September</SelectItem>
                  <SelectItem value="OCT">October</SelectItem>
                  <SelectItem value="NOV">November</SelectItem>
                  <SelectItem value="DEC">December</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-y-4 mt-4">
          <div>
            <Label className="mb-2">Year</Label>
            <Select>
              <SelectTrigger className="lg:w-[240px] cursor-pointer">
                <SelectValue placeholder="Select a year" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2027">2027</SelectItem>
                  <SelectItem value="2029">2029</SelectItem>
                  <SelectItem value="2029">2029</SelectItem>
                  <SelectItem value="2030">2030</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col gap-y-4 mt-4">
          <div>
            <Label className="mb-2">Question Type</Label>
            <Select>
              <SelectTrigger className="lg:w-[240px] cursor-pointer">
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="DESCRIPTIVE">Descriptive</SelectItem>
                  <SelectItem value="MULTIPLE_CHOICE">MCQ</SelectItem>
                  <SelectItem value="SINGLE_CHOICE">Single Choice</SelectItem>
                  <SelectItem value="TRUE_FALSE">True or False</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-y-4 mt-4">
          <div>
            <Label className="mb-2">Marks</Label>
            <Input
              type="text"
              value={subjectId}
              className="lg:w-[240px]"
              placeholder="Enter marks"
              onChange={(e) => setSubjectId(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-4 mt-4">
          <div>
            <Label className="mb-2">Priority</Label>
            <Input
              type="text"
              value={subjectId}
              className="lg:w-[240px]"
              placeholder="Enter priority"
              onChange={(e) => setSubjectId(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestions;
