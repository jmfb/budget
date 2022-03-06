FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
ARG version
WORKDIR /usr/local/src
COPY ./server .
RUN dotnet publish \
	--configuration Release \
	--runtime linux-x64 \
	--self-contained false \
	--output /app/publish \
	-p:PublishReadyToRun=true \
	-p:Version=$version

FROM public.ecr.aws/lambda/dotnet:5.0
WORKDIR /var/task
COPY --from=build /app/publish .
CMD ["Budget.Server::Budget.Server.LambdaEntryPoint::FunctionHandlerAsync"]
