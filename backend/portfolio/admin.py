from django.contrib import admin
from .models import UserProfile, Skill, Project, ProjectTechnology, Experience, Education

# Register your models here.

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'location', 'created_at', 'updated_at')
    search_fields = ('user__username', 'title', 'location')
    list_filter = ('created_at', 'updated_at')

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'profile')
    search_fields = ('name',)
    list_filter = ('profile',)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'profile', 'created_at', 'updated_at')
    search_fields = ('title', 'description')
    list_filter = ('created_at', 'updated_at', 'profile')

@admin.register(ProjectTechnology)
class ProjectTechnologyAdmin(admin.ModelAdmin):
    list_display = ('name', 'project')
    search_fields = ('name',)
    list_filter = ('project',)

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('position', 'company', 'profile', 'start_date', 'end_date', 'current')
    search_fields = ('position', 'company')
    list_filter = ('current', 'start_date', 'end_date', 'profile')

@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('degree', 'institution', 'profile', 'start_date', 'end_date', 'current')
    search_fields = ('degree', 'institution', 'field_of_study')
    list_filter = ('current', 'start_date', 'end_date', 'profile')
