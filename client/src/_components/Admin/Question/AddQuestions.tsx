import { fetchActiveBoards } from "@/api/boards";
import { getAllQuestionPaper } from "@/api/questionPapers";
import { getAllActiveSections } from "@/api/sections";
import { fetchActiveStandards } from "@/api/standards";
import { getAllSubjects } from "@/api/subjects";
import { getAllSubtopics } from "@/api/subtopics";
import { fetchAllActiveTopics } from "@/api/topics";
import { uploadJsonToSupabase } from "@/utils/downloadFromSupabaseStorage";
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

import { addQuestions } from "@/api/questions";
import { toast } from "sonner";
import { useAuth0 } from "@auth0/auth0-react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type AddQuestionsType = {
  performedBy: string;
  boardCode: string;
  standardCode: string;
  subject: string;
  year: string;
  month: string;
  questionId: string;
  questionPaperId: string;
  sectionId: string;
  topicId: string;
  subTopicId: string;
  marks: number;
  priority: number;
  questionType: string;
  questionContentPath: string;
  questionAnswerPath: string;
  attributes: {
    notes: string;
  };
};

const AddQuestions = () => {
  const [loading, setLoading] = useState(false);

  const { user } = useAuth0();

  const [boardData, setBoardData] = useState<any[]>([]);
  const [boardId, setBoardId] = useState("");

  const [standardCode, setStandardCode] = useState<any[]>([]);
  const [standardId, setStandardId] = useState("");

  const [subject, setSubject] = useState<any[]>([]);
  const [subjectId, setSubjectId] = useState("");

  const [qp, setQp] = useState<any[]>([]);
  const [qpId, setQpId] = useState("");

  const [topicData, setTopicData] = useState<any[]>([]);
  const [topicId, setTopicId] = useState("");

  const [sectionData, setSectionData] = useState<any[]>([]);
  const [sectionId, setSectionId] = useState("");

  const [subtopicData, setSubtopicData] = useState<any[]>([]);
  const [subTopicId, setSubTopicId] = useState("");

  // NEW: Month, Year, QuestionType, Marks, Priority state
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [marks, setMarks] = useState("");
  const [priority, setPriority] = useState("");

  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number | null>(
    null
  );

  const loadBoards = async () => {
    setLoading(true);
    try {
      const response = await fetchActiveBoards();
      setBoardData(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load boards");
    } finally {
      setLoading(false);
    }
  };

  const loadStandards = async () => {
    setLoading(true);
    try {
      const response = await fetchActiveStandards();
      setStandardCode(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load standards");
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const response = await getAllSubjects();
      setSubject(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  const loadQuestionPaper = async () => {
    setLoading(true);
    try {
      const response = await getAllQuestionPaper();
      setQp(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load question papers");
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async () => {
    setLoading(true);
    try {
      const response = await fetchAllActiveTopics();
      setTopicData(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load topics");
    } finally {
      setLoading(false);
    }
  };

  const loadSections = async () => {
    setLoading(true);
    try {
      const response = await getAllActiveSections();
      setSectionData(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load sections");
    } finally {
      setLoading(false);
    }
  };

  const loadSubtopics = async () => {
    setLoading(true);
    try {
      const response = await getAllSubtopics();
      setSubtopicData(response);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load subtopics");
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
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  const handleSubmit = async () => {
    // Validate required fields
    if (
      !boardId ||
      !standardId ||
      !subjectId ||
      !sectionId ||
      !topicId ||
      !subTopicId ||
      !qpId ||
      !month ||
      !year ||
      !questionType ||
      !marks ||
      !priority
    ) {
      toast.error("Please fill all fields");
      return;
    }

    // Define JSON strictly as object
    let questionContentJson: object;
    let questionAnswerJson: object;

    if (questionType === "MULTIPLE_CHOICE") {
      if (
        !questionText ||
        options.some((o) => !o) ||
        correctOptionIndex === null
      ) {
        toast.error("Please complete the MCQ fields");
        return;
      }

      questionContentJson = {
        question: questionText,
        options,
      };

      questionAnswerJson = {
        answer: correctOptionIndex,
      };
    } else if (questionType === "DESCRIPTIVE") {
      if (!questionText || !answerText) {
        toast.error("Please complete the descriptive fields");
        return;
      }

      questionContentJson = {
        question: questionText,
      };

      questionAnswerJson = {
        answer: answerText,
      };
    } else {
      toast.error("Invalid question type");
      return;
    }

    const timestamp = Date.now();

    const questionContentPath = await uploadJsonToSupabase(
      questionContentJson,
      `question-${timestamp}`
    );

    const questionAnswerPath = await uploadJsonToSupabase(
      questionAnswerJson,
      `answer-${timestamp}`
    );

    if (!questionContentPath || !questionAnswerPath) {
      toast.error("Failed to upload question or answer JSON.");
      return;
    }

    const payload: AddQuestionsType = {
      attributes: {
        notes: "This is questions needs to be reviewed",
      },
      boardCode: boardId,
      standardCode: standardId,
      subject: subjectId,
      sectionId,
      topicId,
      subTopicId,
      questionPaperId: qpId,
      questionId: "ABCDHEFFASDSADA",
      month,
      year,
      marks: Number(marks),
      priority: Number(priority),
      performedBy: user?.sub!,
      questionContentPath,
      questionAnswerPath,
      questionType,
    };

    try {
      setLoading(true);
      await addQuestions(payload);
      toast.success("Question added successfully!");
      // Optional: clear form
    } catch (error) {
      console.error(error);
      toast.error("Failed to add question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-start items-start w-full flex-col lg:gap-y-6 lg:px-10">
      {/* Boards, Standards, Subjects */}
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col gap-y-4 mt-4">
          <Label className="mb-2">Board</Label>
          <Select value={boardId} onValueChange={setBoardId}>
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
        <div className="flex flex-col gap-y-4 mt-4">
          <Label className="mb-2">Standard</Label>
          <Select value={standardId} onValueChange={setStandardId}>
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
        <div className="flex flex-col gap-y-4 mt-4">
          <Label className="mb-2">Subject</Label>
          <Select value={subjectId} onValueChange={setSubjectId}>
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

      {/* Section, Topic, Subtopic */}
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col gap-y-4 mt-4">
          <Label className="mb-2">Section</Label>
          <Select value={sectionId} onValueChange={setSectionId}>
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
        <div className="flex flex-col gap-y-4 mt-4">
          <Label className="mb-2">Topic</Label>
          <Select value={topicId} onValueChange={setTopicId}>
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
        <div className="flex flex-col gap-y-4 mt-4">
          <Label className="mb-2">Subtopic</Label>
          <Select value={subTopicId} onValueChange={setSubTopicId}>
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

      {/* Question Paper, Month, Year */}
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col gap-y-4 mt-4">
          <Label className="mb-2">Question Paper</Label>
          <Select value={qpId} onValueChange={setQpId}>
            <SelectTrigger className="lg:w-[240px] cursor-pointer">
              <SelectValue placeholder="Select a question paper" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {qp.map((qpItem) => (
                  <SelectItem key={qpItem.id} value={qpItem.id}>
                    {qpItem.attributes.type}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-y-4 mt-4">
          <Label className="mb-2">Month</Label>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="lg:w-[240px] cursor-pointer">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-y-4 mt-4">
          <Label className="mb-2">Year</Label>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="lg:w-[240px] cursor-pointer">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Question Type, Marks, Priority */}
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col gap-y-4 mt-4">
          <Label className="mb-2">Question Type</Label>
          <Select value={questionType} onValueChange={setQuestionType}>
            <SelectTrigger className="lg:w-[240px] cursor-pointer">
              <SelectValue placeholder="Select question type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {["MULTIPLE_CHOICE", "DESCRIPTIVE", "TRUE_FALSE"].map((qt) => (
                  <SelectItem key={qt} value={qt}>
                    {qt}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-y-4 mt-4">
          <Label className="mb-2">Marks</Label>
          <Input
            type="number"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            placeholder="Enter marks"
            className="lg:w-[240px]"
          />
        </div>

        <div className="flex flex-col gap-y-4 mt-4">
          <Label className="mb-2">Priority</Label>
          <Input
            type="number"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            placeholder="Enter priority"
            className="lg:w-[240px]"
          />
        </div>
      </div>

      {questionType === "MULTIPLE_CHOICE" && (
        <div className="flex flex-col w-full gap-4 mt-4">
          <Label>Question</Label>
          <Input
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter the question"
          />

          <Label className="mt-4">Options</Label>
          {options.map((opt, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <Input
                value={opt}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[idx] = e.target.value;
                  setOptions(newOptions);
                }}
                placeholder={`Option ${idx + 1}`}
              />
              <input
                type="radio"
                checked={correctOptionIndex === idx}
                onChange={() => setCorrectOptionIndex(idx)}
              />
              <Label>Select as correct</Label>
            </div>
          ))}
        </div>
      )}

      {questionType === "DESCRIPTIVE" && (
        <div className="flex flex-col gap-4 mt-4 w-full">
          <Label>Question</Label>
          <Input
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter the question"
          />

          <Label>Answer</Label>
          <Input
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Enter the answer"
          />
        </div>
      )}

      {/* Submit Button */}
      <Button onClick={handleSubmit} size="lg" className="rounded-none">
        Add Question
      </Button>
    </div>
  );
};

export default AddQuestions;
