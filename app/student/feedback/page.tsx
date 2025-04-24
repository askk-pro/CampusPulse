"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Star } from "lucide-react"

export default function FeedbackPage() {
    const { user } = useAuth()
    const { toast } = useToast()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [studentId, setStudentId] = useState<string | null>(null)
    const [subjects, setSubjects] = useState<any[]>([])
    const [faculty, setFaculty] = useState<any[]>([])
    const [formData, setFormData] = useState({
        subjectId: "",
        facultyId: "",
        text: "",
        rating: 5,
    })

    useEffect(() => {
        async function fetchData() {
            if (!user) return

            // Get student ID
            const { data: student } = await supabase.from("students").select("id").eq("user_id", user.id).single()

            if (student) {
                setStudentId(student.id)

                // Fetch subjects
                const { data: subjectsData } = await supabase.from("subjects").select("id, name, code").order("name")

                setSubjects(subjectsData || [])

                // Fetch faculty
                const { data: facultyData } = await supabase.from("faculty").select("id, users(id, name)").order("users(name)")

                setFaculty(facultyData || [])
            }

            setLoading(false)
        }

        fetchData()
    }, [user])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!studentId) {
            toast({
                title: "Error",
                description: "Student profile not found",
                variant: "destructive",
            })
            return
        }

        if (!formData.subjectId || !formData.facultyId || !formData.text) {
            toast({
                title: "Missing fields",
                description: "Please fill in all required fields",
                variant: "destructive",
            })
            return
        }

        setSubmitting(true)

        const { error } = await supabase.from("feedback").insert({
            student_id: studentId,
            faculty_id: formData.facultyId,
            subject_id: formData.subjectId,
            text: formData.text,
            rating: formData.rating,
        })

        if (error) {
            toast({
                title: "Error submitting feedback",
                description: error.message,
                variant: "destructive",
            })
        } else {
            toast({
                title: "Feedback submitted",
                description: "Thank you for your feedback!",
            })

            // Reset form
            setFormData({
                subjectId: "",
                facultyId: "",
                text: "",
                rating: 5,
            })
        }

        setSubmitting(false)
    }

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Submit Feedback</h1>
                <p className="text-muted-foreground">Share your thoughts about your courses and instructors</p>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Course Feedback Form</CardTitle>
                        <CardDescription>Your feedback helps improve the quality of education</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Select Subject</Label>
                            <Select
                                value={formData.subjectId}
                                onValueChange={(value: string) => setFormData({ ...formData, subjectId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map((subject) => (
                                        <SelectItem key={subject.id} value={subject.id}>
                                            {subject.name} ({subject.code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="faculty">Select Faculty</Label>
                            <Select
                                value={formData.facultyId}
                                onValueChange={(value: string) => setFormData({ ...formData, facultyId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a faculty member" />
                                </SelectTrigger>
                                <SelectContent>
                                    {faculty.map((f) => (
                                        <SelectItem key={f.id} value={f.id}>
                                            {f.users.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="feedback">Your Feedback</Label>
                            <Textarea
                                id="feedback"
                                placeholder="Share your thoughts about the course and teaching..."
                                rows={5}
                                value={formData.text}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    setFormData({ ...formData, text: e.target.value })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rating">Rating</Label>
                            <div className="flex items-center space-x-2">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                        key={rating}
                                        type="button"
                                        className="focus:outline-none"
                                        onClick={() => setFormData({ ...formData, rating })}
                                    >
                                        <Star
                                            className={`h-6 w-6 ${rating <= formData.rating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300 dark:text-gray-600"
                                                }`}
                                        />
                                    </button>
                                ))}
                                <span className="ml-2 text-sm text-muted-foreground">{formData.rating}/5</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Feedback"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
