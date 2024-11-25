from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Skill, Project, ProjectTechnology, Experience, Education

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

class ProjectTechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTechnology
        fields = ('id', 'name')

class ProjectSerializer(serializers.ModelSerializer):
    technologies = ProjectTechnologySerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = ('id', 'title', 'description', 'image', 'live_url', 'github_url', 
                 'technologies', 'created_at', 'updated_at')

    def create(self, validated_data):
        technologies_data = self.context.get('technologies', [])
        project = Project.objects.create(**validated_data)
        
        for tech_data in technologies_data:
            ProjectTechnology.objects.create(project=project, **tech_data)
        
        return project

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ('id', 'company', 'position', 'description', 'start_date', 
                 'end_date', 'current', 'created_at', 'updated_at')

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ('id', 'institution', 'degree', 'field_of_study', 'description',
                 'start_date', 'end_date', 'current', 'created_at', 'updated_at')

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    projects = ProjectSerializer(many=True, read_only=True)
    experiences = ExperienceSerializer(many=True, read_only=True)
    education = EducationSerializer(many=True, read_only=True)

    class Meta:
        model = UserProfile
        fields = ('id', 'user', 'avatar', 'title', 'bio', 'location', 'phone',
                 'website', 'github', 'linkedin', 'twitter', 'skills', 'projects',
                 'experiences', 'education', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
