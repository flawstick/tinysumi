"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  MapPin,
  Image,
  AlertTriangle,
  X,
  Upload,
} from "lucide-react";

// Define memory interface
interface Memory {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  images: string[];
  tags: string[];
}

export function MemoriesTable() {
  // Initial memories data
  const [memories, setMemories] = useState<Memory[]>([
    {
      id: 1,
      title: "Our First Date",
      date: "2022-06-15",
      location: "Central Park, New York",
      description:
        "We had our first date at a cute little café in Central Park. We talked for hours and watched the sunset together. It was the perfect beginning to our story.",
      images: [
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      tags: ["first date", "café", "sunset"],
    },
    {
      id: 2,
      title: "Beach Weekend Getaway",
      date: "2022-08-10",
      location: "Malibu Beach",
      description:
        "We spent a wonderful weekend at Malibu Beach. We built sandcastles, went swimming, and had a romantic dinner by the ocean. The sound of the waves and your laughter made it magical.",
      images: [
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      tags: ["beach", "weekend", "ocean"],
    },
    {
      id: 3,
      title: "Our First Concert Together",
      date: "2022-10-05",
      location: "Madison Square Garden",
      description:
        "We saw your favorite band live at Madison Square Garden. I'll never forget how you sang along to every song and the way your eyes lit up when they played your favorite track.",
      images: ["/placeholder.svg?height=600&width=800"],
      tags: ["concert", "music", "night out"],
    },
    {
      id: 4,
      title: "Holiday Season Together",
      date: "2022-12-25",
      location: "Home Sweet Home",
      description:
        "Our first Christmas together was so special. We decorated the tree, exchanged gifts, and spent the day watching holiday movies. Your smile when you opened my gift made my heart melt.",
      images: [
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      tags: ["christmas", "holidays", "home"],
    },
  ]);

  // New memory form state
  const [newMemory, setNewMemory] = useState<Omit<Memory, "id">>({
    title: "",
    date: "",
    location: "",
    description: "",
    images: [],
    tags: [],
  });

  // Edit memory state
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewMemoryDialogOpen, setIsNewMemoryDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [memoryToDelete, setMemoryToDelete] = useState<number | null>(null);

  // Tag input state
  const [tagInput, setTagInput] = useState("");
  const [editTagInput, setEditTagInput] = useState("");

  // Add new memory
  const handleAddMemory = () => {
    if (!newMemory.title.trim()) {
      return; // Don't add empty memories
    }

    const newMemoryWithId: Memory = {
      ...newMemory,
      id: memories.length > 0 ? Math.max(...memories.map((m) => m.id)) + 1 : 1,
    };

    setMemories([...memories, newMemoryWithId]);
    setIsNewMemoryDialogOpen(false);

    // Reset form
    setNewMemory({
      title: "",
      date: "",
      location: "",
      description: "",
      images: [],
      tags: [],
    });
    setTagInput("");
  };

  // Delete memory
  const handleDeleteMemory = () => {
    if (memoryToDelete !== null) {
      setMemories(memories.filter((memory) => memory.id !== memoryToDelete));
      setMemoryToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Start editing memory
  const handleEditMemory = (memory: Memory) => {
    setEditingMemory(memory);
    setIsEditDialogOpen(true);
  };

  // Save edited memory
  const handleSaveEdit = () => {
    if (editingMemory) {
      setMemories(
        memories.map((memory) =>
          memory.id === editingMemory.id ? editingMemory : memory,
        ),
      );
      setIsEditDialogOpen(false);
      setEditingMemory(null);
      setEditTagInput("");
    }
  };

  // Add tag to new memory
  const handleAddTag = () => {
    if (tagInput.trim() && !newMemory.tags.includes(tagInput.trim())) {
      setNewMemory({
        ...newMemory,
        tags: [...newMemory.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  // Remove tag from new memory
  const handleRemoveTag = (tag: string) => {
    setNewMemory({
      ...newMemory,
      tags: newMemory.tags.filter((t) => t !== tag),
    });
  };

  // Add tag to editing memory
  const handleAddEditTag = () => {
    if (
      editingMemory &&
      editTagInput.trim() &&
      !editingMemory.tags.includes(editTagInput.trim())
    ) {
      setEditingMemory({
        ...editingMemory,
        tags: [...editingMemory.tags, editTagInput.trim()],
      });
      setEditTagInput("");
    }
  };

  // Remove tag from editing memory
  const handleRemoveEditTag = (tag: string) => {
    if (editingMemory) {
      setEditingMemory({
        ...editingMemory,
        tags: editingMemory.tags.filter((t) => t !== tag),
      });
    }
  };

  // Add placeholder image to new memory
  const handleAddImage = () => {
    setNewMemory({
      ...newMemory,
      images: [...newMemory.images, "/placeholder.svg?height=600&width=800"],
    });
  };

  // Remove image from new memory
  const handleRemoveImage = (index: number) => {
    setNewMemory({
      ...newMemory,
      images: newMemory.images.filter((_, i) => i !== index),
    });
  };

  // Add placeholder image to editing memory
  const handleAddEditImage = () => {
    if (editingMemory) {
      setEditingMemory({
        ...editingMemory,
        images: [
          ...editingMemory.images,
          "/placeholder.svg?height=600&width=800",
        ],
      });
    }
  };

  // Remove image from editing memory
  const handleRemoveEditImage = (index: number) => {
    if (editingMemory) {
      setEditingMemory({
        ...editingMemory,
        images: editingMemory.images.filter((_, i) => i !== index),
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Memories</h1>
          <p className="text-muted-foreground">
            Manage special memories with your girlfriend.
          </p>
        </div>
        <Button onClick={() => setIsNewMemoryDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Memory
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Memories</CardTitle>
          <CardDescription>
            View and manage all memories. Click on a memory to edit or delete
            it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Images</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memories.map((memory) => (
                  <TableRow key={memory.id}>
                    <TableCell className="font-medium">
                      {memory.title}
                    </TableCell>
                    <TableCell>{formatDate(memory.date)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                        <span className="max-w-[150px] truncate">
                          {memory.location}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-secondary/50">
                        <Image className="mr-1 h-3 w-3" />
                        {memory.images.length}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex max-w-[200px] flex-wrap gap-1">
                        {memory.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="border-primary/20 bg-primary/10 text-primary"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {memory.tags.length > 2 && (
                          <Badge variant="outline" className="bg-secondary/50">
                            +{memory.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleEditMemory(memory)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => {
                              setMemoryToDelete(memory.id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {memories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No memories found. Add a memory to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Memory Dialog */}
      <Dialog
        open={isNewMemoryDialogOpen}
        onOpenChange={setIsNewMemoryDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Memory</DialogTitle>
            <DialogDescription>
              Create a new memory to cherish your special moments together.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] space-y-4 overflow-y-auto py-4 pr-2">
            <div className="space-y-2">
              <Label htmlFor="title">Memory Title</Label>
              <Input
                id="title"
                value={newMemory.title}
                onChange={(e) =>
                  setNewMemory({ ...newMemory, title: e.target.value })
                }
                placeholder="Enter memory title"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newMemory.date}
                  onChange={(e) =>
                    setNewMemory({ ...newMemory, date: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newMemory.location}
                  onChange={(e) =>
                    setNewMemory({ ...newMemory, location: e.target.value })
                  }
                  placeholder="Enter location"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newMemory.description}
                onChange={(e) =>
                  setNewMemory({ ...newMemory, description: e.target.value })
                }
                placeholder="Describe this special memory"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Images</Label>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {newMemory.images.map((image, index) => (
                  <div
                    key={index}
                    className="group relative aspect-video overflow-hidden rounded-md bg-secondary/20"
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Memory ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={handleAddImage}
                  className="flex aspect-video flex-col items-center justify-center border-dashed"
                >
                  <Upload className="mb-1 h-6 w-6" />
                  <span className="text-xs">Add Image</span>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex space-x-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tags"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddTag}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {newMemory.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewMemoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddMemory}>
              <Plus className="mr-2 h-4 w-4" /> Add Memory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Memory Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Memory</DialogTitle>
            <DialogDescription>
              Make changes to your special memory.
            </DialogDescription>
          </DialogHeader>
          {editingMemory && (
            <div className="max-h-[60vh] space-y-4 overflow-y-auto py-4 pr-2">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Memory Title</Label>
                <Input
                  id="edit-title"
                  value={editingMemory.title}
                  onChange={(e) =>
                    setEditingMemory({
                      ...editingMemory,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter memory title"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editingMemory.date}
                    onChange={(e) =>
                      setEditingMemory({
                        ...editingMemory,
                        date: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={editingMemory.location}
                    onChange={(e) =>
                      setEditingMemory({
                        ...editingMemory,
                        location: e.target.value,
                      })
                    }
                    placeholder="Enter location"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingMemory.description}
                  onChange={(e) =>
                    setEditingMemory({
                      ...editingMemory,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe this special memory"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Images</Label>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {editingMemory.images.map((image, index) => (
                    <div
                      key={index}
                      className="group relative aspect-video overflow-hidden rounded-md bg-secondary/20"
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Memory ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveEditImage(index)}
                        className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={handleAddEditImage}
                    className="flex aspect-video flex-col items-center justify-center border-dashed"
                  >
                    <Upload className="mb-1 h-6 w-6" />
                    <span className="text-xs">Add Image</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags</Label>
                <div className="flex space-x-2">
                  <Input
                    id="edit-tags"
                    value={editTagInput}
                    onChange={(e) => setEditTagInput(e.target.value)}
                    placeholder="Add tags"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddEditTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddEditTag}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {editingMemory.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveEditTag(tag)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this memory? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-4 text-amber-500">
            <AlertTriangle className="h-16 w-16" />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMemory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
