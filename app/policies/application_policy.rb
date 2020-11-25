class ApplicationPolicy < BasePolicy
  def is_client
    return true if record.project.user == user
  end

  def is_specialist
    return true if record.specialist == user
  end

  # Wether or not the user has access to read information about the application.
  def read
    is_client || is_specialist || admin?
  end

  def write
    is_client || is_specialist || admin?
  end

  def create_task
    is_client || is_specialist || admin?
  end
end
