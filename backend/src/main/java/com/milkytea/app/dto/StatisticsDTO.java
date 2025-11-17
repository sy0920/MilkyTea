package com.milkytea.app.dto;

public class StatisticsDTO {
    private Long totalCount;
    private Long recentCount;
    private Double totalSpent;
    private Double averageRating;
    private String favoriteBrand;

    public StatisticsDTO(Long totalCount, Long recentCount, Double totalSpent, 
                        Double averageRating, String favoriteBrand) {
        this.totalCount = totalCount;
        this.recentCount = recentCount;
        this.totalSpent = totalSpent;
        this.averageRating = averageRating;
        this.favoriteBrand = favoriteBrand;
    }

    // Getters and Setters
    public Long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(Long totalCount) {
        this.totalCount = totalCount;
    }

    public Long getRecentCount() {
        return recentCount;
    }

    public void setRecentCount(Long recentCount) {
        this.recentCount = recentCount;
    }

    public Double getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(Double totalSpent) {
        this.totalSpent = totalSpent;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public String getFavoriteBrand() {
        return favoriteBrand;
    }

    public void setFavoriteBrand(String favoriteBrand) {
        this.favoriteBrand = favoriteBrand;
    }
}
