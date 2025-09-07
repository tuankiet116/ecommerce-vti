{{/*
Expand the name of the chart.
*/}}
{{- define "ecommerce-vti.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "ecommerce-vti.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "ecommerce-vti.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "ecommerce-vti.labels" -}}
helm.sh/chart: {{ include "ecommerce-vti.chart" . }}
{{ include "ecommerce-vti.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "ecommerce-vti.selectorLabels" -}}
app.kubernetes.io/name: {{ include "ecommerce-vti.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Backend image
*/}}
{{- define "ecommerce-vti.backend.image" -}}
{{- printf "%s/%s:%s-%s" .Values.image.registry .Values.image.repository .Values.backend.image.name .Values.image.tag }}
{{- end }}

{{/*
Frontend image
*/}}
{{- define "ecommerce-vti.frontend.image" -}}
{{- printf "%s/%s:%s-%s" .Values.image.registry .Values.image.repository .Values.frontend.image.name .Values.image.tag }}
{{- end }}

{{/*
Horizon image
*/}}
{{- define "ecommerce-vti.horizon.image" -}}
{{- printf "%s/%s:%s-%s" .Values.image.registry .Values.image.repository .Values.horizon.image.name .Values.image.tag }}
{{- end }}

{{/*
Scheduler image
*/}}
{{- define "ecommerce-vti.scheduler.image" -}}
{{- printf "%s/%s:%s-%s" .Values.image.registry .Values.image.repository .Values.scheduler.image.name .Values.image.tag }}
{{- end }}
