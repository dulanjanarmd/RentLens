package com.rentlens.controller;

import com.rentlens.model.BlogPost;
import com.rentlens.repository.BlogPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BlogPostController {

    private final BlogPostRepository blogPostRepository;

    @GetMapping
    public ResponseEntity<List<BlogPost>> getAllBlogs() {
        return ResponseEntity.ok(blogPostRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogPost> getBlogById(@PathVariable Long id) {
        return blogPostRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlogPost> createBlog(@RequestBody BlogPost blogPost) {
        BlogPost saved = blogPostRepository.save(blogPost);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlogPost> updateBlog(@PathVariable Long id, @RequestBody BlogPost blogPostDetails) {
        return blogPostRepository.findById(id)
                .map(blog -> {
                    blog.setTitle(blogPostDetails.getTitle());
                    blog.setContent(blogPostDetails.getContent());
                    blog.setExcerpt(blogPostDetails.getExcerpt());
                    blog.setAuthor(blogPostDetails.getAuthor());
                    blog.setImageUrl(blogPostDetails.getImageUrl());
                    return ResponseEntity.ok(blogPostRepository.save(blog));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        if (!blogPostRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        blogPostRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
